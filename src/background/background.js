// background.js
import sayHello from "./hello";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "greet") {
        sendResponse({status: "success", message: `${sayHello(request.message.name)}`});
    }
})

chrome.runtime.onInstalled.addListener(()=>{
    chrome.contextMenus.create({
        id:"collect-word",
        title: "add to vocabulary",
        contexts:["selection"]
    })
})

chrome.contextMenus.onClicked.addListener((info,tab)=>{
    if(info.menuItemId === "collect-word"){
        const selectedWord=info.selectionText;
        console.log("collected word: ",selectedWord);

        //logic
        chrome.tabs.sendMessage(tab.id,{
            action:"show-translation-modal",
            word: selectedWord
        })
    }
})