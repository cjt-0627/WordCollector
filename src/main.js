import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'

const popupEl = document.getElementById('app')
if (popupEl) {
    // Popup context: mount directly
    createApp(App).mount(popupEl)
} else {
    // Content script context: isolate inside Shadow DOM
    const host = document.createElement('div')
    const shadow = host.attachShadow({ mode: 'open' })
    document.body.appendChild(host)

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = chrome.runtime.getURL('content.css')
    shadow.appendChild(link)

    const mountPoint = document.createElement('div')
    shadow.appendChild(mountPoint)
    createApp(App).mount(mountPoint)
}