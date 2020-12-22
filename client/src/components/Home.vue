<template>
  <v-container>
    <v-row class="text-center" v-show="!showPhotos && !showCamera">
      <v-col cols="12">
        <v-text-field
          label="Container No."
          v:rules="rules"
          hide-details="auto"
          v-model="containerId"
          style="text-transform:uppercase"
          oninput="this.value = this.value.toUpperCase()"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-btn
          for="files"
          elevation="5"
          outlined
          rounded
          color="primary"
          v-on:click="openCamera"
        >
          <v-icon dark left>fas fa-camera</v-icon>
          Chụp
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-show="showCamera">
      <v-col cols="12" class="text-center"
        >CONTAINER NO: <strong>{{ containerId }}</strong></v-col
      >
      <v-col cols="12">
        <video v-show="true" playsinline autoplay />
      </v-col>
      <v-col cols="4">
        <v-btn
          for="files"
          elevation="5"
          outlined
          rounded
          color="primary"
          :disabled="photoFiles.length > 0 ? false : true"
          v-on:click="viewPhotos"
        >
          <v-icon dark left>fas fa-file-image</v-icon>
          Xem
        </v-btn>
      </v-col>
      <v-col cols="8">
        <v-btn
          for="files"
          elevation="5"
          outlined
          rounded
          color="primary"
          v-on:click="snapshot"
        >
          <v-icon dark left>fas fa-camera</v-icon>
          Chụp
        </v-btn></v-col
      >
    </v-row>
    <v-row v-show="showPhotos" class="text-center">
      <v-col cols="12" class="text-center"
        >CONTAINER NO: <strong>{{ containerId }}</strong></v-col
      >
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
    <v-row v-show="showPhotos" class="text-center">
      <v-col cols="4">
        <v-btn
          for="files"
          elevation="5"
          outlined
          rounded
          color="primary"
          v-on:click="openCamera"
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
          <v-icon dark left>fas fa-save</v-icon>
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
          <v-icon dark left>fas fa-trash-alt</v-icon>
          Xóa
        </v-btn></v-col
      >
    </v-row>
    <v-overlay :value="snapshotAlert" opacity="0.7" color="#fff"> </v-overlay>
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
  </v-container>
</template>
<script>
import axios from 'axios';
import FormData from 'form-data';
import moment from 'moment';
import configs from '../configs';

export default {
  mounted() {
    this.getDevices()
      .then((res) => {
        console.log('get devices:', res);
      })
      .then(() => {
        this.getMedia().then((res) => {
          console.log('get media', res);
        });
      });

    setInterval(() => {
      this.$forceUpdate();
    }, 4000);
  },
  name: 'Home',
  data() {
    return {
      containerId: '',
      containerFileName: '',
      photoFiles: [],
      photos: [],
      carouselId: 0,
      showCamera: false,
      showPhotos: false,
      showProgressDialog: false,
      snapshotAlert: false,
    };
  },
  methods: {
    openCamera() {
      if (!this.containerId) {
        alert('Vui lòng nhập Container No');
      } else {
        this.showPhotos = false;
        this.showCamera = true;
      }
    },

    async snapshot() {
      const video = document.querySelector('video');
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext('2d')
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      const file = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );

      if (this.containerFileName == '') {
        this.containerFileName = `${this.containerId}_${moment().format(
          'YYMMDDhhmmss'
        )}`.toUpperCase();
      }

      this.photoFiles.push({
        file,
        name: `${this.containerFileName}_${this.photoFiles.length + 1}`,
        uploading: true,
        uploadCloudSuccess: false,
      });

      this.photos.push(this.readPhotoFile(file));
      this.carouselId = this.photoFiles.length - 1;
      this.snapshotAlert = true;

      setTimeout(() => {
        this.snapshotAlert = false;
      }, 300);
    },

    viewPhotos() {
      this.showPhotos = true;
      this.showCamera = false;
    },

    upload() {
      this.showProgressDialog = true;

      this.photoFiles.forEach(({ file, name }) => {
        let data = new FormData();
        data.append('file', file, name);
        axios
          .post(configs.serverUrl + '/upload', data, {
            headers: {
              accept: 'application/json',
              'Accept-Language': 'en-US,en;q=0.8',
              'Content-Type': `multipart/form-data`,
            },
          })
          .then((response) => {
            let uploadFile = this.photoFiles.find((f) => f.name == name);
            uploadFile.uploading = false;
            const responseData = response.data;

            if (responseData.cloud.success) {
              uploadFile.cloudUrl = responseData.cloud.url;
              uploadFile.uploadCloudSuccess = true;
            } else {
              uploadFile.uploadCloudSuccess = false;
            }

            if (responseData.ftp.success) {
              uploadFile.uploadFtpSuccess = true;
            } else {
              uploadFile.uploadFtpSuccess = false;
            }
          });
      });
    },

    readPhotoFile(photoFile) {
      var img = document.createElement('img');
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
      this.containerId = '';
      this.containerFileName = '';
      this.showProgressDialog = false;
      this.showPhotos = false;
      this.photoFiles = [];
      this.photos = [];
    },

    async getMedia() {
      const video = document.querySelector('video');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });

      window.stream = stream;
      video.srcObject = window.stream;
      return true;
    },

    async getDevices() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return false;
      }

      let allDevices = await navigator.mediaDevices.enumerateDevices();
      console.log(allDevices);

      return true;
    },
  },
};
</script>

<style scoped>
video {
    width: 100%;
}
</style>
