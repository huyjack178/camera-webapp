<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        Take a photo for container <strong> {{ containerId }} </strong>
      </v-col>
      <v-col cols="12">
        <video
          v-show="!isPhotoTaken"
          ref="camera"
          :width="450"
          :height="337.5"
          autoplay
        ></video>
        <canvas
          v-show="isPhotoTaken"
          id="photoTaken"
          ref="canvas"
          :width="450"
          :height="337.5"
        ></canvas>
      </v-col>
      <v-col cols="12">
        <v-btn
          elevation="5"
          outlined
          rounded
          color="primary"
          v-on:click="onBack"
        >
          Back
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  mounted: function() {
    this.createCameraElement();
  },
  props: ['containerId'],
  data() {
    return {
      isPhotoTaken: false,
    };
  },
  methods: {
    onBack() {
      this.$router.push({ name: 'home' }).catch((err) => {
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
