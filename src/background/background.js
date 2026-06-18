import { db } from '../firebase'
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, deleteDoc, setDoc, getDoc } from "firebase/firestore"

import OpenAI from 'openai'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "start_google_login") {
    const clientId = "607973663178-77310te3pai19cup4ef6g61u5bn4us5s.apps.googleusercontent.com";
    const redirectUri = chrome.identity.getRedirectURL();
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&response_type=id_token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email%20profile&nonce=random123`;

    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    }, function (responseUrl) {
      if (chrome.runtime.lastError || !responseUrl) {
        console.error("登入失敗: ", chrome.runtime.lastError?.message);
        return;
      }

      const params = new URLSearchParams(new URL(responseUrl.replace('#', '?')).search);
      const idToken = params.get('id_token');

      if (idToken) {
        chrome.storage.local.set({ pendingGoogleToken: idToken }, () => {
          console.log("Token 儲存成功，交給 Popup");
        });
      }
    });
    return true;
  }

  if (request.action === "save_word_to_firebase") {
    chrome.storage.local.get(['uid', 'defaultBook'], async (result) => {
      const uid = result.uid
      const currentBook = result.defaultBook || "collected words"

      if (!uid) {
        sendResponse({ success: false, error: "Not logged in" })
        return
      }

      try {
        const userWordRef = collection(db, "users", uid, "words")
        const q = query(userWordRef, where("word", "==", request.word))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          sendResponse({ success: false, reason: "duplicate" })
          return 
        }
        
        await addDoc(userWordRef, {
          word: request.word,
          translation: request.translation,
          createdAt: serverTimestamp(),
          book: currentBook
        })
        console.log("Saved word success")
        sendResponse({ success: true })
      } catch (error) {
        console.error("Fail to save in Firebase: ", error)
        sendResponse({ success: false, error: error.message })
      }
    })
    return true;
  }

  if (request.action === 'fetchModels') {
    handleFetchModels(request.apiUrl, request.apiKey, sendResponse);
    return true;
  }
  
  if (request.action === 'translateWithAI') {
    handleTranslation(request.word, request.settings, sendResponse);
    return true;
  }

});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "collect-word",
    title: "search for the word",
    contexts: ["selection"]
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "collect-word") {
    const selectedWord = info.selectionText;
    console.log("collected word: ", selectedWord);

    chrome.storage.local.get(['translationMethod'], (result) => {
      const method = result.translationMethod || "google"
      if (method === "cambridge") {
        const cambridgeUrl = `https://dictionary.cambridge.org/dictionary/english-chinese-traditional/${encodeURIComponent(selectedWord)}`
        chrome.tabs.create({ url: cambridgeUrl })
      } else {
        chrome.tabs.sendMessage(tab.id, {
          action: "show-translation-modal",
          word: selectedWord
        })
      }
    })
  }
})

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  console.log("Received message from extranet : ", message);
  if (message.action === "login_success") {
    const idToken = message.idToken
    if (idToken) {
      chrome.storage.local.set({ idToken: idToken }, () => {
        console.log("Token sync success")
        sendResponse({ status: "success", message: "Extension sync success " })
      })
    } else {
      sendResponse({ status: "fail", message: "Token is empty" })
    }
  }
  return true
})

async function handleFetchModels(apiUrl, apiKey, sendResponse) {
  try {
    if (!apiUrl || !apiKey) {
      sendResponse({ success: false, error: "Please fill in API URL and API Key first!" });
      return;
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: apiUrl,
      dangerouslyAllowBrowser: true
    });

    const list = await openai.models.list();
    const models = [];

    for await (const model of list) {
      models.push(model.id.replace('models/', ''));
    }

    sendResponse({ success: true, models: models });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

async function handleTranslation(word, settings, sendResponse) {
  try {
    const { apiUrl, apiKey, selectedModel } = settings;

    if (!apiUrl || !apiKey || !selectedModel) {
      sendResponse({ success: false, error: "Please complete APIURL, APIKEY, and model name!" });
      return;
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: apiUrl
    });

    const TranslationResult = z.object({
      chinese: z.string(),
      parts_of_speech: z.string(),
      example_sentences: z.string(),
    });

    const completion = await openai.chat.completions.parse({
      model: selectedModel,
      messages: [
        { role: "system", content: "你是一個專業的英漢字典助手。請將使用者輸入的英文單字翻譯成繁體中文，並附上詞性。請提供簡潔的翻譯，並視情況提供一個例句。" },
        { role: "user", content: word },
      ],
      response_format: zodResponseFormat(TranslationResult, "translationResult"),
    });

    const parsedResult = completion.choices[0].message.parsed;
    sendResponse({ success: true, data: parsedResult });

  } catch (error) {
    sendResponse({ success: false, error: "AI failed to translate: " + error.message });
  }
}