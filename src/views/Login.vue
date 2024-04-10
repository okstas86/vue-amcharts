<template>
  <div class="container">
    <h1 class="title">LeadHit</h1>
    <form class="form" @submit.prevent="checkInput">
      <label class="label" for="siteId">ID сайта</label>
      <input
        class="input"
        :class="error && 'error-class'"
        type="text"
        id="siteId"
        v-model="siteId"
        @input="clearError"
      />
      <button class="btn" type="submit">Войти</button>
      <p class="error" v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import store from '../store/index'

const siteId = ref('')
const error = ref('')

function clearError() {
  error.value = ''
}
console.log(import.meta.env.VITE_SITE_ID)
async function checkInput() {
  if (siteId.value.length !== 24) {
    error.value = 'id сайта должен содержать 24 символа'
    return
  } else if (siteId.value !== import.meta.env.VITE_SITE_ID) {
    error.value = 'Неправильный id сайта'
    return
  }
  try {
    await store.dispatch('handleLogin', siteId.value)
  } catch (error) {
    console.error('Ошибка при авторизации:', error)
  }
}
</script>

<style scoped>
.container {
  width: 80%;
  height: 80vh;
  display: flex;
  gap: 2rem;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
  margin: 3rem auto;
}

.title {
  font-size: 3.5rem;
  letter-spacing: 1.5rem;
  font-weight: 900;
  margin-top: 4rem;
}
.form {
  width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.label {
  font-size: 1rem;
  font-weight: 400;
}
.input {
  padding: 0.7rem 1rem;
  border-radius: 0.5rem;
  border: 2px solid #4a4a4a;
}
.btn {
  padding: 0.7rem 4rem;
  background-color: #67b7dc;
  color: #fff;
  font-size: 1.2rem;
  transition: all 0.5s;
  border-radius: 0.5rem;
  border: none;
}
.btn:hover,
.btn:active {
  background-color: #4a4a4a;
}
.error {
  color: red;
}
.error-class {
  border: 2px solid red;
}
</style>
