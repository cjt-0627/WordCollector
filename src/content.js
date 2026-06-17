console.log('content.js survived!!!')

import { createApp } from 'vue'
import ContentApp from './ContentApp.vue'

const host = document.createElement('div')
host.id = 'word-collector-extension-container'
document.body.appendChild(host)

const shadowRoot = host.attachShadow({ mode: 'open' })

const appContainer = document.createElement('div')
shadowRoot.appendChild(appContainer)

if (window.location.hostname === 'dictionary.cambridge.org') {
  const interval = setInterval(() => {
    const mainWordElement = document.querySelector('.hw.dhw')
    const defBlocks = document.querySelectorAll('.def-block')
    if (mainWordElement && defBlocks.length > 0) {
      clearInterval(interval)
      injectCambridgeSingleButton(mainWordElement)
    }
  }, 1000)
}

function injectCambridgeSingleButton(mainWordElement) {
  if (mainWordElement.parentElement.querySelector('.wc-add-btn')) return

  const mainWord = mainWordElement.textContent.trim()

  const btn = document.createElement('button')
  btn.innerHTML = '+'
  btn.className = 'wc-add-btn'
  btn.style.cssText = `
    margin-left: 12px; 
    cursor: pointer; 
    background: #198754; 
    color: white; 
    border: none; 
    border-radius: 4px; 
    padding: 4px 10px; 
    font-size: 16px;
    vertical-align: middle;
    font-weight: bold;
  `

  btn.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()

    const defBlocks = document.querySelectorAll('.def-block')
    let translationParts = []
    let count = 1

    defBlocks.forEach(block => {
      // 這裡是在抓「整個意思的中文解釋」
      const transElement = block.querySelector('.trans.dtrans.dtrans-se, .trans.dtrans')
      if (!transElement) return

      let blockText = `${count}. ${transElement.textContent.trim()}`

      const exampleElements = block.querySelectorAll('.examp.dexamp')
      if (exampleElements.length > 0) {
        blockText += '\nsentence:'
        exampleElements.forEach(ex => {
          
          // 這裡是你原本放錯位置的「分開抓取中英文例句」邏輯，必須放在這裡才抓得到 ex
          const egElement = ex.querySelector('.eg')
          // 加上 Ex 避免與上面的 transElement 變數名稱混淆
          const transElementEx = ex.querySelector('.trans') 

          if (egElement && transElementEx) {
            const egText = egElement.textContent.trim().replace(/\s+/g, ' ')
            const transText = transElementEx.textContent.trim().replace(/\s+/g, ' ')
            // 在中文前面加上縮排空白，讓版面更好看
            blockText += `\n- ${egText}\n   ${transText}`
          } else {
            blockText += '\n- ' + ex.textContent.trim().replace(/\s+/g, ' ')
          }
        })
      }
      translationParts.push(blockText)
      count++
    })

    if (translationParts.length === 0) {
      alert("Can't detect translation!")
      return
    }

    const finalTranslation = translationParts.join('\n\n')

    btn.innerHTML = 'Loading...'
    btn.disabled = true

    chrome.runtime.sendMessage({
      action: "save_word_to_firebase",
      word: mainWord,
      translation: finalTranslation
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Runtime error: ", chrome.runtime.lastError)
        btn.innerHTML = 'x'
        btn.disabled = false
        return
      }

      if (response && response.success) {
        btn.innerHTML = '✓'
        btn.style.background = '#0f5132'
      } else if (response && response.reason === "duplicate") {
        alert(`${mainWord} has existed!`)
        btn.innerHTML = '+'
        btn.disabled = false
      } else {
        alert("Fail to save: " + (response?.error || "Unknown error"))
        btn.innerHTML = '+'
        btn.disabled = false
      }
    })
  })

  mainWordElement.parentNode.insertBefore(btn, mainWordElement.nextSibling)
}

const app = createApp(ContentApp, { isPopup: false })
app.mount(appContainer)

const style = document.createElement('style')
style.textContent = `
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