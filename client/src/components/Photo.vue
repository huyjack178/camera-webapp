<template>
  <v-carousel cycle hide-delimiter-background>
    <v-carousel-item
      v-for="(item, i) in state.photoFiles"
      :key="i"
      :src="item.src"
    ></v-carousel-item>
  </v-carousel>
</template>

<script>
import store from "../store";

export default {
  mounted: function() {
    console.log(this.state.photoFiles);
    this.$forceUpdate();
  },
  props: ["containerId"],
  data() {
    return {
      state: store.state,
    };
  },
  methods: {
    onBack() {
      this.$router.push({ name: "home" }).catch((err) => {
        console.log(err);
      });
    },
  },
};
</script>
