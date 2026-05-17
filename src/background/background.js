import sayHello from "./hello"
import { auth } from "../firebase"
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth"

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "greet") {
        sendResponse({ status: "success", message: `${sayHello(request.message.name)}` });
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

        chrome.tabs.sendMessage(tab.id, {
            action: "show-translation-modal",
            word: selectedWord
        })
    }
})

chrome.runtime.onMessageExternel.addListener((request, sender, sendResponse) => {
    if (request.action === "login_success" && request.idToken) {
        const credential = GoogleAuthProvider.credential(null, request.idToken)

        signInWithCredential(auth, credential).then((userCredential) => {
            console.log("chrome-extension background sign in success: ", userCredential.user)
            chrome.storage.local.set({ uid: userCredential.user.uid })
            sendResponse({ status: "success" })
        }).catch((errror) => {
            console.error("chrome-extension background sign in fail: ", error)
            sendResponse({ status: "error", message: error.message })
        })
        return ture
    }
})