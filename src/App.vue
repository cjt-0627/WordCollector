<script setup>
import { ref } from "vue";

const props = defineProps({
  isPopup: {
    type: Boolean,
    default: false
  }
});

const name = ref("");

function sendMsgToBg() {
  chrome.runtime.sendMessage(
    { action: "greet", message: { name: name.value } },
    (response) => {
      if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError);
      } else {
        console.log('bg sent this: ', response)
        alert(`Response from background: ${response.message}`);
      }
    }
  );
}

const isModalVisible = ref(false);
const currentWord = ref("");
const translationText = ref("");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "show-translation-modal") {
    console.log("【除錯】彈出視窗被觸發了！目前版本：測試版"); // 檢查 Console 有沒有這行
    currentWord.value = request.word;
    isModalVisible.value = true;
    translationText.value = `(searching ${request.word})`;
    sendResponse({ status: "modal_opened" });
  }
});

function closeModal() {
  isModalVisible.value = false;
}
</script>

<template>
  <div v-if="props.isPopup" class="container py-3">
    <button type="button" class="btn btn-success w-100">collected words</button>
  </div>

  <div v-if="!props.isPopup && isModalVisible" class="position-fixed top-0 end-0 m-4" style="z-index: 2147483647;">
    
    <div style="width: 22rem; background-color: #fffbcc; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 2px solid #ccc; overflow: hidden; font-family: sans-serif; color: #333;">
      
      <div style="padding: 16px;">
        <h5 style="font-size: 1.25rem; font-weight: bold; margin: 0 0 8px 0; color: #000;">{{ currentWord }}</h5>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 12px 0;">

        <p style="min-height: 3rem; color: #555; margin: 0 0 16px 0; font-size: 14px;">
          {{ translationText }}
        </p>
        
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button style="background: white; border: 1px solid #6c757d; color: #6c757d; padding: 6px 12px; border-radius: 4px; cursor: pointer;" @click="closeModal">cancel</button>
          <button style="background: #198754; border: none; color: white; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;" @click="closeModal">store word</button>
        </div>
      </div>
    </div>
  </div>
</template>