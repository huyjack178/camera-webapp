<template>
  <v-container>
    <v-row class="text-center" v-show="!viewPhotos">
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
          v-on:click="showCamera"
        >
          <v-icon dark left>fas fa-camera</v-icon>
          Chụp
        </v-btn>
        <input
          v-show="false"
          type="file"
          ref="camera"
          multiple="multiple"
          id="camera"
          accept="image/*"
          capture="camera"
          v-on:change="onCapture"
        />
      </v-col>
    </v-row>
    <v-row v-show="viewPhotos" class="text-center">
      <v-col cols="12">
        <v-carousel ref="carousel" v-model="carouselId">
          <v-carousel-item
            v-for="(item, i) in photos"
            :key="i"
            :src="item.src"
          ></v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <v-row v-show="viewPhotos" class="text-center">
      <v-col cols="4">
        <v-btn
          for="files"
          elevation="5"
          outlined
          rounded
          color="primary"
          v-on:click="showCamera"
        >
          <v-icon dark left>fas fa-camera</v-icon>
          Chụp
        </v-btn></v-col
      >
      <v-col cols="4">
        <v-btn
          for="files"
          elevation="5"
          outlined
          rounded
          color="primary"
          v-on:click="upload"
        >
          <v-icon dark left>fas fa-camera</v-icon>
          Ghi
        </v-btn></v-col
      >
      <v-col cols="4">
        <v-btn
          for="files"
          elevation="5"
          outlined
          rounded
          color="primary"
          v-on:click="showCamera"
        >
          <v-icon dark left>fas fa-camera</v-icon>
          Xóa
        </v-btn></v-col
      >
    </v-row>
  </v-container>
</template>
<script>
import axios from "axios";
import FormData from "form-data";

export default {
  mounted() {
    setInterval(() => {
      this.$forceUpdate();
    }, 4000);
  },
  name: "Home",
  data() {
    return {
      containerId: "",
      viewPhotos: false,
      photoFiles: [],
      photos: [],
      carouselId: 0,
    };
  },
  methods: {
    showCamera() {
      if (!this.containerId) {
        alert("Please input container ID");
      } else {
        this.$refs.camera.click();
      }
    },

    onCapture() {
      this.viewPhotos = true;
      var file = this.$refs.camera.files[0];
      this.photoFiles.push(file);
      this.photos.push(this.readPhotoFile(file));
      this.carouselId = this.photoFiles.length - 1;
    },

    upload() {
      let data = new FormData();

      this.photoFiles.forEach((file) => {
        data.append("file", file, file.fileName);
      });

      axios
        .post("http://localhost:3000/upload", data, {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          },
        })
        .then((response) => console.log(response));
    },

    readPhotoFile(photoFile) {
      var img = document.createElement("img");
      var reader = new FileReader();
      reader.onloadend = function() {
        img.src = reader.result;
      };
      reader.readAsDataURL(photoFile);
      console.log(img);
      return img;
    },
  },
};
</script>
