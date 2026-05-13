import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'

const isPopupContext = window.location.protocol === 'chrome-extension:';

if (isPopupContext) {
    const popupEl = document.getElementById('app')
    if (popupEl) {
        createApp(App, { isPopup: true }).mount(popupEl)
    }
} else {
    const host = document.createElement('div')
    const shadow = host.attachShadow({ mode: 'open' })
    document.body.appendChild(host)

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = chrome.runtime.getURL('content.css')
    shadow.appendChild(link)

    const bsLink=document.createElement('link')
    bsLink.rel='stylesheet'
    bsLink.href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css'
    shadow.appendChild(bsLink)

    const mountPoint = document.createElement('div')
    shadow.appendChild(mountPoint)
    createApp(App, { isPopup: false }).mount(mountPoint)
}