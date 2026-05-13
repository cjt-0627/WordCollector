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
  <div class="container py-3" >
    <div class="row">
      <div class="col-12" >
        <button type="button" class="btn btn-success w-100">collected words</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>