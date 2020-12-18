import Vue from 'vue'
import VueRouter from 'vue-router'
import Camera from '../components/Camera.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/camera/:containerId',
    name: 'camera',
    component: Camera,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
