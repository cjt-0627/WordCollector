<script setup>
import { ref } from "vue"

const isModalVisible = ref(false)
const currentWord = ref("")
const translationText = ref("")


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "show-translation-modal") {
    currentWord.value = request.word
    isModalVisible.value = true
    translationText.value = `(Google translating ${request.word}...)`

    translateWithGoogle(request.word)
  }
  sendResponse({ status: "modal_opened" })
});

function closeModal() {
  isModalVisible.value = false
}

function saveWord() {

  chrome.runtime.sendMessage({
    action: "save_word_to_firebase",
    word: currentWord.value,
    translation: translationText.value
  }, (response) => {

    if (response && response.success) {
      //alert("Saved word");
      closeModal();
    } else {
      alert("Fail to save word");
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
</script>

<template>
  <div v-if="isModalVisible" style="position: fixed; top: 20px; right: 20px; z-index: 2147483647;">
    <div
      style="width: 22rem; background-color: #fffbcc; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 2px solid #ccc; overflow: hidden; font-family: sans-serif; color: #333;">
      <div style="padding: 16px;">
        <h5 style="font-size: 1.25rem; font-weight: bold; margin: 0 0 8px 0; color: #000;">{{ currentWord }}</h5>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 12px 0;">
        <p style="min-height: 3rem; color: #555; margin: 0 0 16px 0; font-size: 14px;">
          {{ translationText }}
        </p>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button
            style="background: white; border: 1px solid #6c757d; color: #6c757d; padding: 6px 12px; border-radius: 4px; cursor: pointer;"
            @click="closeModal">cancel</button>
          <button
            style="background: #198754; border: none; color: white; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;"
            @click="saveWord">save word</button>
        </div>
      </div>
    </div>
  </div>
</template>