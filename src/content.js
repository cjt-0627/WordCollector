console.log('content.js survived!!!')

import { createApp } from 'vue'
import ContentApp from './ContentApp.vue'

const host =document.createElement('div')
host.id='word-collector-extension-container'
document.body.appendChild(host)

const shadowRoot =host.attachShadow({mode:'open'})

const appContainer=document.createElement('div')
shadowRoot.appendChild(appContainer)

const app=createApp(ContentApp,{isPopup:false})
app.mount(appContainer)

const style=document.createElement('style')
style.textContent=`
  .checkmark {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: block;
    stroke-width: 4;
    stroke: #198754;
    stroke-miterlimit: 10;
    box-shadow: inset 0px 0px 0px #198754;
    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
  }
  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 4;
    stroke-miterlimit: 10;
    stroke: #198754;
    fill: none;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }
  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards;
  }
  @keyframes stroke {
    100% { stroke-dashoffset: 0; }
  }
  @keyframes scale {
    0%, 100% { transform: none; }
    50% { transform: scale3d(1.1, 1.1, 1); }
  }
  @keyframes fill {
    100% { box-shadow: inset 0px 0px 0px 30px rgba(25, 135, 84, 0.1); }
  }
`
shadowRoot.appendChild(style)
