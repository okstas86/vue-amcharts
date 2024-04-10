import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Analytics from '../views/Analytics.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/analytics',
      component: Analytics,
      beforeEnter: (to, from, next) => {
        const leadhitSiteId = localStorage.getItem('leadhit-site-id')
        if (!leadhitSiteId) {
          next('/login')
        } else {
          next()
        }
      }
    }
  ]
})

export default router
