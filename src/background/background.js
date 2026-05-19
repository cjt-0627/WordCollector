import { db } from '../firebase'
import { collection, addDoc, serverTimestamp} from "firebase/firestore"

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "start_google_login") {
    const clientId = "607973663178-r4sl2nmgsb88rsdo583b2v4ehdjb9k62.apps.googleusercontent.com"
    const redirectUri = chrome.identity.getRedirectURL();
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&response_type=id_token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email%20profile&nonce=random123`


    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    }, function (responseUrl) {
      if (chrome.runtime.lastError || !responseUrl) {
        console.error("Fail to login or Cancel: ", chrome.runtime.lastError?.message)
        return
      }


      const params = new URLSearchParams(new URL(responseUrl.replace('#', '?')).search)
      const idToken = params.get('id_token')

      if (idToken) {

        chrome.storage.local.set({ pendingGoogleToken: idToken }, () => {
          console.log("Token saved, waiting for popup")
        })
      }
    })

    return true
  }

  if (request.action === "save_word_to_firebase") {
    chrome.storage.local.get(['uid'], async (result) => {
      const uid = result.uid
      if (!uid) {
        sendResponse({ success: false, error: "Not logged in" })
        return
      }

      try {
        const userWordRef = collection(db, "users", uid, "words")
        await addDoc(userWordRef, {
          word: request.word,
          translation: request.translation,
          createdAt: serverTimestamp()
        })
        console.log("Saved word success")
        sendResponse({ success: true })
      } catch (error) {
        console.error("Fail to save in Firebase: ", error)
        sendResponse({ success: false, error: error.message })
      }
    })
    return true
  }

})

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "collect-word",
    title: "add to vocabulary",
    contexts: ["selection"]
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "collect-word") {
    const selectedWord = info.selectionText;
    console.log("collected word: ", selectedWord);

    //logic
    chrome.tabs.sendMessage(tab.id, {
      action: "show-translation-modal",
      word: selectedWord
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