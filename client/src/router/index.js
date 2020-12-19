import Vue from 'vue'
import VueRouter from 'vue-router'
import Photo from '../components/Photo.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/photo/:containerId',
    name: 'photo',
    component: Photo,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
