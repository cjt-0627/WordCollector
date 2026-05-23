<script setup>
import { ref } from "vue"

const isModalVisible = ref(false)
const currentWord = ref("")
const translationText = ref("")
const isSuccess = ref(false)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "show-translation-modal") {
    chrome.storage.local.get(['translationMethod', 'selectedModel', 'apiKey', 'apiUrl'], (result) => {
      const method = result.translationMethod || "google"
      const model = result.selectedModel || ""
      if (method === 'ai' && model.trim() === "") {
        alert("Please set up your AI model!")
        return
      }
      currentWord.value = request.word
      isModalVisible.value = true
      isSuccess.value = false

      if (method === "ai") {
        translationText.value = `(AI translating ${request.word}...)`
        translateWithAI(request.word, result)
      } else {
        translationText.value = `(Google translating ${request.word})`
        translateWithGoogle(request.word)
      }
    })

  }
  sendResponse({ status: "modal_opened" })
});

function closeModal() {
  isModalVisible.value = false
  isSuccess.value = false
}

function saveWord() {

  chrome.runtime.sendMessage({
    action: "save_word_to_firebase",
    word: currentWord.value,
    translation: translationText.value
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Runtime error: ", chrome.runtime.lastError)
      return
    }

    console.log('Save word response: ', response)
    if (response && response.success) {

      isSuccess.value = true
      setTimeout(() => {
        closeModal()
      }, 1500)
    } else if (response && response.reason === "duplicate") {
      alert(`${currentWord.value} has existed!`)
    } else {
      alert("Fail to save word" + (response?.error || "Unknown error"))
    }
  });
}

async function translateWithGoogle(word) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-TW&dt=t&q=${encodeURIComponent(word)}`
    const response = await fetch(url)
    const data = await response.json();
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      translationText.value = data[0][0][0]
    } else {
      translationText.value = "fail to translate"
    }
  } catch (error) {
    translationText.value = "An error occurred"
  }
}

async function translateWithAI(word, settings){
  try{
    const{apiUrl,apiKey,selectedModel}=setttings
    //to-do 
    translationText.value=`AI translation result`
  }catch(error){
    console.error(error)
    translationText.value="AI translation failed"
  }
}
</script>

<template>
  <div v-if="isModalVisible" style="position: fixed; top: 20px; right: 20px; z-index: 2147483647;">
    <div
      style="width: 22rem; background-color: #fffbcc; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 2px solid #ccc; overflow: hidden; font-family: sans-serif; color: #333;">

      <div v-if="isSuccess"
        style="padding: 30px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 140px;">
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
          <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <p style="margin-top: 15px; font-weight: bold; color: #198754; font-size: 1.1rem; margin-bottom: 0;">Saved
          successfully!</p>
      </div>

      <div v-else style="padding: 16px;">
        <h5 style="font-size: 1.25rem; font-weight: bold; margin: 0 0 8px 0; color: #000;">{{ currentWord }}</h5>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 12px 0;">
        <p style="min-height: 3rem; color: #555; margin: 0 0 16px 0; font-size: 14px;">
          {{ translationText }}
        </p>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button
            style="background: white; border: 1px solid #6c757d; color: #6c757d; padding: 6px 12px; border-radius: 4px; cursor: pointer;"
            @click="closeModal">Cancel</button>
          <button
            style="background: #198754; border: none; color: white; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;"
            @click="saveWord">Save word</button>
        </div>
      </div>

    </div>
  </div>
</template>