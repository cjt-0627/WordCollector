console.log('content.js survived!!!')

import { createApp } from 'vue'
import ContentApp from './ContentApp.vue'

const host =document.createElement('div')
host.id='word-collector-extension-container'
document.body.appendChild(host)

const shadowRoot =host.attachShadow({mode:'open'})

const appContainer=document.createElement('div')
shadowRoot.appendChild(appContainer)

const app=createApp(App,{isPopup:false})
app.mount(appContainer)


