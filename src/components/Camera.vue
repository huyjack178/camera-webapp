<template>
  <v-carousel>
    <v-carousel-item
      v-for="(item, i) in items"
      :key="i"
      :src="item.src"
      reverse-transition="fade-transition"
      transition="fade-transition"
    ></v-carousel-item>
  </v-carousel>
</template>
<script>
export default {
  mounted: function () {
    this.createCameraElement();
  },
  props: ["containerId"],
  data() {
    return {
      isPhotoTaken: false,
    };
  },
  methods: {
    onBack() {
      this.$router.push({ name: "home" }).catch((err) => {
        console.log(err);
      });
    },
    createCameraElement() {
      this.isLoading = true;

      const constraints = (window.constraints = {
        audio: false,
        video: true,
      });

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.$refs.camera.srcObject = stream;
        })
        .catch(() => {
          alert("May the browser didn't support or there is some errors.");
        });
    },
  },
};
</script>
