<template>
  <div>
    <h1>LeadHit</h1>
    <form @submit.prevent="handleLogin">
      <label for="siteId">ID сайта:</label>
      <input type="text" id="siteId" v-model="siteId" @input="clearError" />
      <button type="submit">Войти</button>
      <p v-if="error" style="color: red">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      siteId: '',
      error: ''
    }
  },
  methods: {
    clearError() {
      this.error = ''
    },
    handleLogin() {
      if (this.siteId.length !== 24) {
        this.error = 'id сайта должен содержать 24 символа'
        return
      }

      // Выполнение HTTP запроса
      axios
        .get('https://track-api.leadhit.io/client/test_auth', {
          headers: {
            'Api-Key': '5f8475902b0be670555f1bb3:eEZn8u05G3bzRpdL7RiHCvrYAYo',
            'Leadhit-Site-Id': this.siteId
          }
        })
        .then((response) => {
          if (response.data.message === 'ok') {
            console.log(response.data)
            this.$store.commit('setLeadhitSiteId', this.siteId)
            this.$router.push('/analytics')
          }
        })
        .catch((error) => {
          console.error('Ошибка при авторизации:', error)
          this.error = 'Ошибка при авторизации'
        })
    }
  }
}
</script>
