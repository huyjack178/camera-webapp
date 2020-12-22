<template>
  <v-container>
    <v-dialog
      v-model="showProgressDialog"
      persistent
      width="500"
      class="text-center"
    >
      <v-card>
        <v-card-title class="headline">
          Upload ảnh đến cloudinary và ftp server ...
        </v-card-title>
        <v-card-text>
          <li
            v-for="item in photoFiles"
            :key="item.name"
            class="mt-3"
            style="list-style:none;"
          >
            <div>
              <strong> {{ item.name }}&nbsp;</strong>
            </div>
            <v-progress-circular
              v-show="item.uploading"
              :width="3"
              :size="20"
              color="primary"
              indeterminate
            ></v-progress-circular>
            <div>
              <span v-show="!item.uploading && item.uploadCloudSuccess"
                >Cloud
                <v-icon small color="green darken-2">
                  fas fa-check-circle
                </v-icon></span
              >

              <span v-show="!item.uploading && !item.uploadCloudSuccess"
                >Cloud
                <v-icon small color="red darken-2">
                  fas fa-check-times
                </v-icon></span
              >
              <a
                v-show="!item.uploading && item.uploadCloudSuccess"
                target="_blank"
                v-bind:href="item.cloudUrl"
                >{{ item.cloudUrl }}</a
              >
            </div>
            <div>
              <span v-show="!item.uploading && item.uploadFtpSuccess"
                >FTP
                <v-icon small color="green darken-2">
                  fas fa-check-circle
                </v-icon></span
              >

              <span v-show="!item.uploading && !item.uploadFtpSuccess"
                >FTP
                <v-icon small color="red darken-2">
                  fas fa-check-times
                </v-icon></span
              >
            </div>
          </li>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="backToHomePage">
            Chuyển về trang chủ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      showProgressDialog: false,
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
      this.showProgressDialog = true;

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
      this.showProgressDialog = false;
      this.viewPhotos = false;
      this.photoFiles = [];
      this.photos = [];
    },
  },
};
</script>
