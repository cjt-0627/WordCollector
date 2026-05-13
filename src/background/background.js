// background.js
import sayHello from "./hello";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "greet") {
        sendResponse({status: "success", message: `${sayHello(request.message.name)}`});
    }
})