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
    <div class="row">
      <div class="col-12">
        <button type="button" class="btn btn-success w-100">collected words</button>
      </div>
    </div>
  </div>

  <div v-if="!props.isPopup && isModalVisible" class="position-fixed top-0 end-0 m-4" style="z-index: 2147483647">
    <div class="card shadow-lg border-0" style="width: 22rem">
      <div class="card-header bg-primary text-white font-weight-bold">
        Word Collector
      </div>
      <div class="card-body">
        <h5 class="card-title fw-bold text-dark mb-1">{{ currentWord }}</h5>
        
        <hr class="my-2">

        <p class="card-text text-secondary mt-2 mb-4" style="min-height: 3rem">
          {{ translationText }}
        </p>
        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-outline-secondary btn-sm px-3" @click="closeModal">cancel</button>
          <button class="btn btn-success btn-sm px-3" @click="closeModal">store word</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>