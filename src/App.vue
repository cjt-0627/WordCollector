<script setup>
import { ref, onMounted, watch, nextTick } from "vue"
import { db, auth, googleProvider } from './firebase'
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"
import { signInWithCredential, onAuthStateChanged, signOut, GoogleAuthProvider } from "firebase/auth"

const props = defineProps({
  isPopup: {
    type: Boolean,
    default: false
  }
});

const currentUser = ref(null)
const activeTab = ref("words")

const apiKey = ref("")
const apiUrl = ref("")
const selectedModel = ref("")
const translationMethod = ref("ai")
const isLoaded = ref(false)

onMounted(() => {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {

    chrome.storage.local.get(['translationMethod', 'apiKey', 'apiUrl', 'selectedModel', 'pendingGoogleToken'], async (result) => {

      if (result.translationMethod) translationMethod.value = result.translationMethod
      if (result.apiKey) apiKey.value = result.apiKey
      if (result.apiUrl) apiUrl.value = result.apiUrl
      if (result.selectedModel) selectedModel.value = result.selectedModel

      if (props.isPopup) {
        if (result.pendingGoogleToken) {
          try {
            console.log('found Google Token, start to login Firebase')
            const credential = GoogleAuthProvider.credential(result.pendingGoogleToken)
            const userCredential = await signInWithCredential(auth, credential)

            chrome.storage.local.set({ uid: userCredential.user.uid })
            currentUser.value = userCredential.user
            alert('Login success')
          } catch (error) {
            console.error("Fail to login Firebase: ", error)
            alert("Fail to verify Firebase: " + error.message)
          } finally {

            chrome.storage.local.remove('pendingGoogleToken')
          }
        }


        onAuthStateChanged(auth, (user => {
          if (user) {
            currentUser.value = user
            chrome.storage.local.set({ uid: user.uid })
          } else {
            currentUser.value = null
            chrome.storage.local.remove('uid')
          }
        }))
      }

      nextTick(() => {
        isLoaded.value = true
      })
    })
  }
})


async function loginWithGoogle() {
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.sendMessage({ action: "start_google_login" })

  }
}

async function handleSignOut() {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Sign out failed: ", error)
  }

}

watch([translationMethod, apiKey, apiUrl, selectedModel], () => {

  if (!isLoaded.value) return

  chrome.storage.local.set({
    translationMethod: translationMethod.value,
    apiKey: apiKey.value,
    apiUrl: apiUrl.value,
    selectedModel: selectedModel.value
  })
})



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
        <label for="translationMethod" class="form-label text-muted mb-1" style="font-size:0.85rem">Translation
          Method</label>
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
      <hr class="my-3 text-muted">

      <h6 class="mb-2">Account</h6>
      <div v-if="currentUser" class="mb-2">
        <p class="text-muted mb-2" style="font-size:0.85rem">current sign in: <br>{{ currentUser.email }}</p>
        <button type="button" class="btn btn-outline-danger btn-sm w-100" @click="handleSignOut">
          sign out
        </button>
      </div>
      <div v-else class="mb-2">
        <button type="button" class="btn btn-primary btn-sm w-100" @click="loginWithGoogle">
          sign with Google
        </button>
      </div>
    </div>


  </div>




</template>