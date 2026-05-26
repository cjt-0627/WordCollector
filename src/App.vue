<script setup>
import { ref, onMounted, watch, nextTick } from "vue"
import { db, auth, googleProvider } from './firebase'
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, deleteDoc, setDoc, getDoc, writeBatch } from "firebase/firestore"
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

const books = ref(["collected words"])
const defaultBook = ref("collected words")
const newBookName = ref("")
const currentViewBook = ref("collected words")

const swipedBook = ref(null)

let bookStartX = 0
let startX = 0

const renamingBook = ref(null)
const renameInput = ref("")
let pressTimer = null
let isLongPress = false

function cancelLongPress() {
  if (pressTimer) clearTimeout(pressTimer)
}

async function addNewBook() {
  const name = newBookName.value.trim()
  if (!name) return
  if (books.value.includes(name)) {
    alert("Thid book already exists!")
    return
  }
  books.value.push(name)
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.set({ books: [...books.value] })
  }

  if (currentUser.value) {
    try {
      const uid = currentUser.value.uid
      await setDoc(doc(db, "users", uid), { books: [...books.value] }, { merge: true })
    } catch (error) {
      console.error("Fail to sync new book to Firebase: ", error)
    }
  }
  newBookName.value = ""
}

function setDefaultBook(bookName) {
  defaultBook.value = bookName
  chrome.storage.local.set({ defaultBook: bookName })
}

function handleBookSwipeStart(e, book) {
  bookStartX = e.touches ? e.touches[0].clientX : e.clientX
  isLongPress = false
  if (book !== 'collected words') {
    pressTimer = setTimeout(() => {
      isLongPress = true
      renamingBook.value = book
      renameInput.value = book
      swipedBook.value = null
    }, 600)
  }
}

function handleBookWheel(e, book) {
  if (book === 'collected words') return

  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    if (e.deltaX > 15) {
      swipedBook.value = book
    } else if (e.deltaX < -15) {
      if (swipedBook.value === book) swipedBook.value = null
    }
  }
}

function handleBookSwipeEnd(e, book) {
  cancelLongPress()
  if (book === 'collected words') return

  const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
  const diffX = bookStartX - endX

  if (!isLongPress) {
    if (diffX > 40) {
      swipedBook.value = book
    } else if (diffX < -40) {
      if (swipedBook.value === book) swipedBook.value = null
    }
  }
}

function handleBookClick(book){
  if(isLongPress){
    isLongPress=false
    return
  }
  fetchAndShowWords(book)
}

function handleBookClick(book){
  if(isLongPress){
    isLongPress = false
    return
  }
  fetchAndShowWords(book)
}

async function saveRename(){
  const oldName=renamingBook.value
  const newName=renameInput.value.trim()

  if(!newName || newName===oldName){
    renamingBook.value=null
    return
  }
  if(books.value.includes(newName)){
    alert("This book name already exists!")
    return
  }

  const index=books.value.indexOf(oldName)
  if(index !==-1) books.value[index]=newName
  
  if(defaultBook.value===oldName) setDefaultBook(newName)
  //
}

async function deleteBook(bookName) {

  if (bookName === 'collected words') return

  // double check
  books.value = books.value.filter(b => b !== bookName)

  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.set({ books: [...books.value] })
  }

  if (currentUser.value) {
    try {
      const uid = currentUser.value.uid
      await setDoc(doc(db, "users", uid), { books: [...books.value] }, { merge: true })
    } catch (error) {
      console.error("Fail to sync deleted book to Firebase", error)
    }
  }

  swipedBook.value = null

  if (defaultBook.value === bookName) {
    setDefaultBook('collected words')
  }
}

function handleSwipeStart(e) {
  startX = e.touches ? e.touches[0].clientX : e.clientX
}

function handleWheel(e, item) {
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    if (e.deltaX > 15) {
      savedWords.value.forEach(w => { if (w !== item) w.isSwiped = false })
      item.isSwiped = true

    } else if (e.deltaX < -15) {
      item.isSwiped = false
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

async function fetchAndShowWords(bookName = "collected words") {
  if (!currentUser.value) {
    alert("Please sign in your Google account!")
    return
  }

  currentViewBook.value = bookName
  isSidebarOpen.value = true
  isLoadingWords.value = true

  try {
    const uid = currentUser.value.uid
    const wordsRef = collection(db, "users", uid, "words")
    const querySnapshot = await getDocs(wordsRef)

    const words = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const wordBook = data.book || "collected words"
      if (wordBook === bookName) {
        words.push({ id: doc.id, ...doc.data(), isSwiped: false })
      }

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

    chrome.storage.local.get(['translationMethod', 'apiKey', 'apiUrl', 'selectedModel', 'pendingGoogleToken', 'books', 'defaultBook'], async (result) => {

      if (result.translationMethod) translationMethod.value = result.translationMethod
      if (result.apiKey) apiKey.value = result.apiKey
      if (result.apiUrl) apiUrl.value = result.apiUrl
      if (result.selectedModel) selectedModel.value = result.selectedModel

      if (result.books) books.value = Array.isArray(result.books) ? result.books : ["collected words"]
      if (result.defaultBook) defaultBook.value = result.defaultBook

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


        onAuthStateChanged(auth, async (user) => {
          if (user) {
            currentUser.value = user
            chrome.storage.local.set({ uid: user.uid })

            try {
              const userDoc = await getDoc(doc(db, "users", user.uid))
              if (userDoc.exists() && userDoc.data().books) {
                const cloudBooks = userDoc.data().books
                if (Array.isArray(cloudBooks)) {
                  books.value = cloudBooks
                  chrome.storage.local.set({ books: [...books.value] })
                }
              }
            } catch (error) {
              console.error("Fail to fetch books from Firebase: ", error)
            }
          } else {
            currentUser.value = null
            chrome.storage.local.remove('uid')
            books.value = ["collected words"]
          }
        })
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

    <div class="tab-content position-relative">
      <div v-show="activeTab === 'words'" class="tab-pane fade show active">

        <div class="input-group mb-3">
          <input type="text" class="form-control form-control-sm" placeholder="New vocabulary book..."
            v-model="newBookName" @keyup.enter="addNewBook">
          <button class="btn btn-primary btn-sm" type="button" @click="addNewBook">Add</button>
        </div>

        <ul class="list-group mb-5">
          <li v-for="book in books" :key="book" class="list-group-item p-0 overflow-hidden position-relative bg-danger">

            <div class="book-swipe-container bg-white" :class="{ 'is-swiped': swipedBook === book }"
              @touchstart="handleBookSwipeStart" @touchend="handleBookSwipeEnd($event, book)"
              @mousedown="handleBookSwipeStart" @mouseup="handleBookSwipeEnd($event, book)"
              @wheel="handleBookWheel($event, book)">

              <div class="d-flex justify-content-between align-items-center p-2 w-100">
                <span style="cursor: pointer; flex-grow: 1;" @click="fetchAndShowWords(book)">
                  {{ book }}
                </span>
                <div>
                  <span v-if="defaultBook === book" class="badge bg-success me-2">Default</span>
                  <button v-else class="btn btn-sm btn-outline-secondary me-2" style="font-size: 0.75rem;"
                    @click.stop="setDefaultBook(book)">Set Default</button>
                  <button class="btn btn-sm btn-outline-primary" style="font-size: 0.75rem;"
                    @click.stop="fetchAndShowWords(book)">View</button>
                </div>
              </div>

            </div>
          </li>
        </ul>

        <div v-if="swipedBook && swipedBook !== 'collected words'"
          class="position-fixed bottom-0 start-0 w-100 p-3 d-flex justify-content-between align-items-center shadow-lg"
          style="background-color: #dc3545; z-index: 2147483647; animation: slideUp 0.3s ease-out;">
          <span class="text-white fw-bold text-truncate" style="max-width: 55%;">Delete "{{ swipedBook }}"?</span>
          <div>
            <button class="btn btn-sm btn-light me-2 fw-bold" @click="swipedBook = null">Cancel</button>

            <button class="btn btn-sm btn-dark fw-bold d-flex align-items-center d-inline-flex"
              @mousedown.stop.prevent="deleteBook(swipedBook)" @touchstart.stop.prevent="deleteBook(swipedBook)"
              @click.stop.prevent="deleteBook(swipedBook)">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                class="bi bi-trash-fill me-1" viewBox="0 0 16 16">
                <path
                  d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="sidebar shadow" :class="{ 'sidebar-open': isSidebarOpen }">
      <div class="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
        <h6 class="m-0 fw-bold">{{ currentViewBook }}</h6>
        <button type="button" class="btn-close" aria-label="Close" @click="isSidebarOpen = false"></button>
      </div>

      <div class="p-3 overflow-auto" style="height: calc(100% - 56px);">
        <div v-if="isLoadingWords" class="text-center text-muted mt-3">Loading...</div>
        <div v-else-if="savedWords.length === 0" class="text-center text-muted mt-3">There is no any words</div>

        <ul v-else class="list-group">
          <li v-for="(item, index) in savedWords" :key="item.id"
            class="list-group-item p-0 overflow-hidden position-relative">

            <div class="swipe-container" :class="{ 'is-swiped': item.isSwiped }" @touchstart="handleSwipeStart"
              @touchend="handleSwipeEnd($event, item)" @mousedown="handleSwipeStart"
              @mouseup="handleSwipeEnd($event, item)" @wheel="handleWheel($event, item)">

              <div class="word-content d-flex flex-column p-3">
                <span class="fw-bold fs-6 text-dark">{{ item.word }}</span>
                <span class="text-muted mt-1" style="font-size: 0.85rem; white-space: pre-wrap; line-height:1.6;">{{
                  item.translation }}</span>
              </div>

              <button class="delete-btn btn btn-danger d-flex align-items-center justify-content-center" @mousedown.stop
                @touchstart.stop @click.stop="deleteWord(item, index)">
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

/* --- 單字專用：包含垃圾桶的滑動外殼 --- */
.swipe-container {
  display: flex;
  width: calc(100% + 70px);
  transition: transform 0.2s ease-out;
  cursor: grab;
}

.swipe-container:active {
  cursor: grabbing;
}

.swipe-container.is-swiped {
  transform: translateX(-70px);
}

.word-content {
  width: calc(100% - 70px);
  flex-shrink: 0;
  background-color: white;
}

.delete-btn {
  width: 70px;
  height: auto;
  border-radius: 0;
  flex-shrink: 0;
}

/* --- ✨ 單字本專用：左滑動畫與樣式 ✨ --- */
.book-swipe-container {
  display: flex;
  width: 100%;
  transition: transform 0.2s ease-out;
  cursor: grab;
}

.book-swipe-container:active {
  cursor: grabbing;
}

.book-swipe-container.is-swiped {
  /* 往左滑動 35px，露出底下我們鋪的紅色底色，提示使用者即將刪除 */
  transform: translateX(-35px);
}

/* 底部彈出面板的進場動畫 */
@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>