<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-text-field
          label="Container ID"
          v:rules="rules"
          hide-details="auto"
          v-model="containerId"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-btn
          for="files"
          elevation="5"
          outlined
          rounded
          color="primary"
          v-on:click="onTakePhoto"
        >
          <v-icon dark left>fas fa-camera</v-icon>
          Take a photo
        </v-btn>
        <input
          v-show="false"
          type="file"
          ref="camera"
          id="camera"
          accept="image/*"
          capture="camera"
          v-on:change="onChange"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'Home',
  data() {
    return {
      containerId: '',
    };
  },
  methods: {
    onTakePhoto() {
      if (!this.containerId) {
        alert('Please input container ID');
      } else {
        // var camera = document.getElementById('camera');
        this.$refs.camera.click();
      }
    },

    onChange() {
      var file = this.$refs.camera.files[0];
      console.log(file);
    }
  },
};
</script>
