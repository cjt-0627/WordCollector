<script setup>
import { ref, onMounted, watch, nextTick } from "vue"
import { db, auth, googleProvider } from './firebase'
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, deleteDoc } from "firebase/firestore"
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

const isSidebarOpen = ref(false)
const savedWords = ref([])
const isLoadingWords = ref(false)

const books=ref(["collected words"])

let startX = 0

function handleSwipeStart(e) {
  startX = e.touches ? e.touches[0].clientX : e.clientX
}

function handleWheel(e,item){
  if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){
    if(e.deltaX>15){
      savedWords.value.forEach(w=>{if(w!==item) w.isSwiped=false})
      item.isSwiped=true

    }else if(e.deltaX<-15){
      item.isSwiped=false
    }
  }
}

function handleSwipeEnd(e, item) {
  const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
  const diffX = startX - endX

  if (diffX > 40) {
    savedWords.value.forEach(w => { if (w !== item) w.isSwiped = false })
    item.isSwiped = true
  } else if (diffX < -40) {
    item.isSwiped = false
  }
}

async function deleteWord(item, index) {
  if (!currentUser.value) return
  //
  try {
    const uid = currentUser.value.uid

    await deleteDoc(doc(db, "users", uid, "words", item.id))

    savedWords.value.splice(index, 1)
  } catch (error) {
    console.error("Fail to delete Firebase", error)
    alert("Fail to delete: " + error.message)
  }
}

async function fetchAndShowWords() {
  if (!currentUser.value) {
    alert("Please sign in your Google account!")
    return
  }

  isSidebarOpen.value = true
  isLoadingWords.value = true

  try {
    const uid = currentUser.value.uid
    const wordsRef = collection(db, "users", uid, "words")
    const querySnapshot = await getDocs(wordsRef)

    const words = []
    querySnapshot.forEach((doc) => {
      words.push({ id: doc.id, ...doc.data(), isSwiped: false })
    })
    savedWords.value = words
  } catch (error) {
    console.error("Fail to fetch words: ", error)
    alert("Fail to fetch words" + error.message)
  } finally {
    isLoadingWords.value = false

  }
}

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
        <button type="button" class="btn btn-success w-100 mb-3" @click="fetchAndShowWords">collected words</button>
      </div>
    </div>

    <div class="sidebar shadow" :class="{ 'sidebar-open': isSidebarOpen }">
      <div class="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
        <h6 class="m-0 fw-bold">My vocabulary</h6>
        <button type="button" class="btn-close" aria-label="Close" @click="isSidebarOpen = false"></button>
      </div>

      <div class="p-3 overflow-auto" style="height: calc(100% - 56px);">
        <div v-if="isLoadingWords" class="text-center text-muted mt-3">Loading...</div>
        <div v-else-if="savedWords.length === 0" class="text-center text-muted mt-3">There is no any words</div>

        <ul v-else class="list-group">
          <li v-for="(item, index) in savedWords" :key="item.id"
            class="list-group-item p-0 overflow-hidden position-relative">

            <div class="swipe-container" 
              :class="{ 'is-swiped': item.isSwiped }" 
              @touchstart="handleSwipeStart"
              @touchend="handleSwipeEnd($event, item)" 
              @mousedown="handleSwipeStart"
              @mouseup="handleSwipeEnd($event, item)"
              @wheel="handleWheel($event, item)">
              
              <div class="word-content d-flex flex-column p-3">
                <span class="fw-bold fs-6 text-dark">{{ item.word }}</span>
                <span class="text-muted mt-1" style="font-size: 0.85rem; white-space: pre-wrap; line-height:1.6;">{{ item.translation }}</span>
              </div>

              <button class="delete-btn btn btn-danger d-flex align-items-center justify-content-center"
                @click.stop="deleteWord(item, index)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                  class="bi bi-trash-fill" viewBox="0 0 16 16">
                  <path
                    d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                </svg>
              </button>
            </div>

          </li>
        </ul>
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
          <option value="cambridge">Cambridge search</option>
        </select>
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
          Sign out
        </button>
      </div>
      <div v-else class="mb-2">
        <button type="button" class="btn btn-primary btn-sm w-100" @click="loginWithGoogle">
          Sign with Google
        </button>
      </div>
    </div>

  </div>




</template>

<style scoped>
/* 側欄基礎樣式 */
.sidebar {
  position: absolute;
  top: 0;
  right: -100%;
  width: 100%;
  height: 100%;
  background-color: white;
  transition: right 0.3s ease-in-out;
  z-index: 1050;
}

.sidebar.sidebar-open {
  right: 0;
}

/* --- 以下為新加入的左滑刪除樣式 --- */

/* 滑動外殼：寬度多出 70px (垃圾桶的寬度) */
.swipe-container {
  display: flex;
  width: calc(100% + 70px);
  transition: transform 0.2s ease-out;
  cursor: grab;
  /* 讓滑鼠懸停時顯示可抓取的手勢 */
}

.swipe-container:active {
  cursor: grabbing;
}

/* 單字內容：填滿原本 list 的 100% 寬度 */
.word-content {
  width: calc(100% - 70px);
  flex-shrink: 0;
  background-color: white;
  /* 防止背景透明看穿 */
}

/* 垃圾桶按鈕樣式 */
.delete-btn {
  width: 70px;
  height: auto;
  border-radius: 0;
  flex-shrink: 0;
}

/* 當啟動左滑狀態時，整體向左移動 70px 露出垃圾桶 */
.swipe-container.is-swiped {
  transform: translateX(-70px);
}
</style>