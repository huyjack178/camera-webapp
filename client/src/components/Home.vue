<template>
  <v-container>
    <upload-dialog
      :photoFiles.sync="photoFiles"
      :showDialog="showUploadDialog"
    />
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
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn
          for="files"
          elevation="5"
          outlined
          rounded
          color="primary"
          :disabled="photoFiles.length > 0 ? false : true"
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
          v-on:click="deletePhoto"
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
import moment from "moment";
import configs from "../configs";
import UploadDialog from "./UploadDialog.vue";

export default {
  mounted() {
    setInterval(() => {
      this.$forceUpdate();
    }, 4000);
  },
  name: "Home",
  components: {
    UploadDialog,
  },
  data() {
    return {
      containerId: "",
      viewPhotos: false,
      photoFiles: [],
      photos: [],
      carouselId: 0,
      showUploadDialog: false,
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
      this.photoFiles.push({
        file,
        name: `${this.containerId}_${moment().format("YYMMDDhhmmss")}_${this
          .photoFiles.length + 1}`,
        uploading: true,
        uploadCloudSuccess: false,
      });

      this.photos.push(this.readPhotoFile(file));
      this.carouselId = this.photoFiles.length - 1;
    },

    upload() {
      this.showUploadDialog = true;

      this.photoFiles.forEach(({ file, name }) => {
        let data = new FormData();
        data.append("file", file, name);
        axios
          .post(configs.serverUrl + "/upload", data, {
            headers: {
              accept: "application/json",
              "Accept-Language": "en-US,en;q=0.8",
              "Content-Type": `multipart/form-data`,
            },
          })
          .then((response) => {
            let file = this.photoFiles.find((file) => file.name == name);
            file.uploading = false;
            const responseData = response.data;

            if (responseData.cloud.success) {
              file.cloudUrl = responseData.cloud.url;
              file.uploadCloudSuccess = true;
            } else {
              file.uploadCloudSuccess = false;
            }

            if (responseData.ftp.success) {
              file.uploadFtpSuccess = true;
            } else {
              file.uploadFtpSuccess = false;
            }
          });
      });
    },

    readPhotoFile(photoFile) {
      var img = document.createElement("img");
      var reader = new FileReader();
      reader.onloadend = function() {
        img.src = reader.result;
      };
      reader.readAsDataURL(photoFile);
      return img;
    },

    deletePhoto() {
      this.photoFiles.splice(this.carouselId, 1);
      this.photos.splice(this.carouselId, 1);

      if (this.photoFiles.length == 0) {
        this.backToHomePage();
      }
    },

    backToHomePage() {
      this.containerId = "";
      this.showUploadDialog = false;
      this.viewPhotos = false;
      this.photoFiles = [];
      this.photos = [];
    },
  },
};
</script>
