<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  isPopup: {
    type: Boolean,
    default: false
  }
});

const activeTab = ref("words");

const apiKey = ref("");
const apiUrl = ref("");
const selectedModel = ref("");

const translationMethod=ref("ai");

onMounted(()=>{
  chrome.storage.local.get(['translationMethod','apiKey','apiUrl','selectedModel'],(result)=>{
    if(result.translationMethod) translationMethod.value=result.translationMethod
    if(result.apiKey) apiKey.value=result.apiKey
    if(result.apiUrl) apiUrl.value=result.apiUrl
    if(result.selectedModel) selectedModel.value=result.selectedModel
  })
})

watch([translationMethod,apiKey,apiUrl,selectedModel],()=>{
  chrome.storage.local.set({
    translationMethod:translationMethod.value,
    apiKey:apiKey.value,
    apiUrl:apiUrl.value,
    selectedModel:selectedModel.value
  })
})

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

    if(translationMethod.value==='ai'){
      translationText.value = `(AI searching ${request.word}...)`;
    }else{
      translationText.value=`(Google translating ${request.word}...)`
      translateWithGoogle(request.word)
    }
  }
  sendResponse({ status: "modal_opened" });

  
});

function closeModal() {
  isModalVisible.value = false;
}

async function translateWithGoogle(word){
  try{
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-TW&dt=t&q=${encodeURIComponent(word)}`
    const response= await fetch(url)
    const data=await response.json();
    if(data && data[0] && data[0][0] && data[0][0][0]){
      translationText.value=data[0][0][0]
    }else{
      translationText.value="fail to translate"
    }
  }catch(error){
    console.error("Google Translate Error:", error)
    translationText.value="An error occurred"
  }
}

</script>

<template>
  <div v-if="props.isPopup" class="container py-2">

    <ul class="nav nav-underline mb-3" id="popupTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link" :class="{ active: activeTab === 'words' }" @click="activeTab = 'words'" type="button">
          Volume
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" :class="{ active: activeTab === 'settings' }" @click="activeTab = 'settings'"
          type="button">
          Settings
        </button>
      </li>
    </ul>
    
    <!-- Volume -->
    <div class="tab-content">
      <div v-show="activeTab === 'words'" class="tab-pane fade show active">
        <button type="button" class="btn btn-success w-100 mb-3">collected words</button>
      </div>
    </div>
    
    <!-- Settings -->
    <div v-show="activeTab === 'settings'" class="tab-pane fade show active">
      <h6 class="mb-2">API settings</h6>

      <div class="mb-2">
        <label for="translationMethod" class="form-label text-muted mb-1" style="font-size:0.85rem">Translation Method</label>
        <select class="form-control form-control-sm" id="translationMethod" v-model="translationMethod">
          <option value="ai">AI translation</option>
          <option value="google">Google translation</option>
        </select>
      </div>

      <div class="mb-2">
        <label for="apiUrl" class="form-label text-muted mb-1" style="font-size:0.85rem">API URL</label>
        <input type="text" class="form-control form-controll-sm" id="apiUrl" v-model="apiUrl"
          placeholder="https://api.openai.com/v1/...">
      </div>

      <div class="mb-2">
        <label for="apiKey" class="form-label text-muted mb-1" style="font-size:0.85rem">API Key</label>
        <input type="password" class="form-control form-controll-sm" id="apiKey" v-model="apiKey" placeholder="sk-...">
      </div>

      <div class="mb-2">
        <label for="selectedModel" class="form-label text-muted mb-1" style="font-size:0.85rem">Model Selection</label>
        <input type="text" class="form-control form-controll-sm" id="selectedModel" v-model="selectedModel"
          placeholder="gpt-4o-mini">
      </div>
    </div>

    
  </div>

  <!-- Content Menu -->
  <div v-if="!props.isPopup && isModalVisible" class="position-fixed top-0 end-0 m-4" style="z-index: 2147483647;">
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
            @click="closeModal">store word</button>
        </div>
      </div>
    </div>
  </div>


</template>