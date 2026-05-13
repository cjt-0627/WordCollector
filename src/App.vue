<script setup>
import { ref } from "vue";

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
</script>

<template>
  <button @click="sendMsgToBg"> Hello </button>, I am: <input v-model="name"/>
</template>

<style scoped>
</style>