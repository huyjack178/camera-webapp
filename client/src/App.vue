<template>
  <v-app>
    <v-main>
      <transition name="fade"> <router-view></router-view></transition>
    </v-main>
  </v-app>
</template>

<script>
// import Home from './components/Home';

export default {
  name: 'App',
  components: {
    // Home,
  },
  data: () => ({
    //
  }),
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
