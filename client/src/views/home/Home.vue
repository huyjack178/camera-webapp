<template>
  <v-container fluid fill-height class="text-center justify-center align-center">
    <v-app-bar app color="primary" dark hide-on-scroll>
      <v-spacer></v-spacer>
      <v-btn text v-on:click="showUploadSettingsDialog = true">
        <span class="mr-2">Cấu hình Upload</span>
        <v-icon>mdi-wrench</v-icon>
      </v-btn>
    </v-app-bar>
    <v-dialog v-model="showProgressDialog" persistent width="500" class="text-center" id="upload-dialog">
      <v-card>
        <v-card-title class="headline"> Đang Upload ... </v-card-title>
        <v-card-text>
          <li v-for="item in photoFiles" :key="item.name" class="mt-3" style="list-style: none">
            <div>
              <strong> {{ item.name }}&nbsp;</strong>
            </div>
            <div v-show="uploadSettings.local.enabled">
              Local Server
              <v-progress-circular
                v-show="item.uploadingLocal"
                :width="3"
                :size="20"
                color="primary"
                indeterminate
              ></v-progress-circular>
              <span v-show="!item.uploadingLocal && item.uploadLocalSuccess">
                <v-icon small color="green darken-2"> fas fa-check-circle </v-icon></span
              >

              <span v-show="!item.uploadingLocal && !item.uploadLocalSuccess">
                <v-icon small color="red darken-2"> fas fa-check-times </v-icon></span
              >
              <div>
                <strong>{{ item.localPath }}</strong>
              </div>
            </div>
            <div v-show="uploadSettings.cloudinary.enabled">
              Cloud
              <span v-show="!item.uploadingCloud && item.uploadCloudSuccess">
                <v-icon small color="green darken-2"> fas fa-check-circle </v-icon></span
              >

              <span v-show="!item.uploadingCloud && !item.uploadCloudSuccess">
                <v-icon small color="red darken-2"> fas fa-check-times </v-icon></span
              >
              <a v-show="!item.uploadingCloud && item.uploadCloudSuccess" target="_blank" v-bind:href="item.cloudUrl">{{
                item.cloudUrl
              }}</a>
              <v-progress-circular
                v-show="item.uploadingCloud"
                :width="3"
                :size="20"
                color="primary"
                indeterminate
              ></v-progress-circular>
            </div>
            <div v-show="uploadSettings.ftp.enabled">
              FTP
              <v-progress-circular
                v-show="item.uploadingFtp"
                :width="3"
                :size="20"
                color="primary"
                indeterminate
              ></v-progress-circular>
              <span v-show="!item.uploadingFtp && item.uploadFtpSuccess">
                <v-icon small color="green darken-2"> fas fa-check-circle </v-icon></span
              >

              <span v-show="!item.uploadingFtp && !item.uploadFtpSuccess">
                <v-icon small color="red darken-2"> fas fa-check-times </v-icon></span
              >
              <div>
                <strong>{{ item.ftpHost }}</strong>
              </div>
            </div>
          </li>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="backToHomePage"> Chuyển về trang chủ </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showUploadSettingsDialog" persistent width="500" class="text-center" id="upload-settings-dialog">
      <v-card>
        <v-card-title class="headline"> Cấu hình Upload </v-card-title>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header> Upload Local </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row justify="space-around" no-gutters>
                <v-col cols="12">
                  <v-switch
                    v-model="uploadSettings.local.enabled"
                    :label="uploadSettings.local.enabled ? 'Tắt' : 'Bật'"
                  ></v-switch>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="IP"
                    placeholder="192.0.0.1 / Để trống để upload lên host server hiện tại"
                    outlined
                    v-model="uploadSettings.local.ip"
                    :disabled="!uploadSettings.local.enabled"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header> Upload FTP </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row justify="space-around" no-gutters>
                <v-col cols="3">
                  <v-switch
                    v-model="uploadSettings.ftp.enabled"
                    :label="uploadSettings.ftp.enabled ? 'Tắt' : 'Bật'"
                  ></v-switch>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    label="Host"
                    placeholder="192.0.0.1"
                    outlined
                    v-model="uploadSettings.ftp.host"
                    :disabled="!uploadSettings.ftp.enabled"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Username"
                    outlined
                    v-model="uploadSettings.ftp.username"
                    :disabled="!uploadSettings.ftp.enabled"
                    class="mr-2"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Password"
                    outlined
                    type="password"
                    v-model="uploadSettings.ftp.password"
                    :disabled="!uploadSettings.ftp.enabled"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header> Upload Cloudinary </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row justify="space-around" no-gutters>
                <v-col cols="3">
                  <v-switch
                    v-model="uploadSettings.cloudinary.enabled"
                    :label="uploadSettings.cloudinary.enabled ? 'Tắt' : 'Bật'"
                  ></v-switch>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    label="Cloud Name"
                    outlined
                    v-model="uploadSettings.cloudinary.cloud_name"
                    :disabled="!uploadSettings.cloudinary.enabled"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="API KEY"
                    outlined
                    v-model="uploadSettings.cloudinary.api_key"
                    :disabled="!uploadSettings.cloudinary.enabled"
                    class="mr-2"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="API SECRET"
                    outlined
                    type="password"
                    v-model="uploadSettings.cloudinary.api_secret"
                    :disabled="!uploadSettings.cloudinary.enabled"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeUploadSettingsDialog"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row v-show="!viewPhotos" id="container-input">
      <v-col cols="12">
        <v-text-field
          label="Container ID"
          style="text-transform: uppercase"
          oninput="this.value = this.value.toUpperCase()"
          :rules="[rules.required, rules.min]"
          outlined
          hide-details="auto"
          v-model="containerId"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-btn for="files" elevation="5" outlined rounded color="primary" v-on:click="showCamera">
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
    <v-row v-show="viewPhotos" id="photo-viewer">
      <v-col cols="12">
        <v-carousel height="auto" ref="carousel" v-model="carouselId">
          <v-carousel-item height="100%" v-for="(item, i) in photos" :key="i">
            <v-img contain :src="item.src" :lazy-src="item.src" class="image">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <v-row v-show="viewPhotos" id="buttons">
      <v-col cols="4">
        <v-btn for="files" elevation="5" outlined rounded color="primary" v-on:click="showCamera">
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
        <v-btn for="files" elevation="5" outlined rounded color="primary" v-on:click="deletePhoto">
          <v-icon dark left>fas fa-camera</v-icon>
          Xóa
        </v-btn></v-col
      >
    </v-row>
  </v-container>
</template>
<script src="./home.js"></script>
<style scoped>
@media only screen and (orientation: landscape) {
  .image {
    height: 240px;
    width: 100%;
  }
}
</style>
