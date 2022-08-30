<template>
  <v-container fluid fill-height class="text-center justify-center align-center">
    <v-app-bar app color="primary" dark>
      <v-btn text v-on:click="backToHomePage()" class="pa-1">
        <v-img class="mr-1" src="~@/assets/fbsoft.png" width="20" />
        Home
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn text v-on:click="showUploadSettingsDialog = true" class="pa-0">
        <span class="mr-1">Cấu hình</span>
        <v-icon>mdi-wrench</v-icon>
      </v-btn>
      <v-btn text v-on:click="logout" class="pr-0">
        Đăng Xuất
        <span class="mr-1"></span>
        <v-icon>mdi-login</v-icon>
      </v-btn>
    </v-app-bar>
    <v-dialog v-model="showProgressDialog" persistent width="500" class="text-center" id="upload-dialog">
      <v-card>
        <v-card-title class="headline"> {{ uploadPopupTitle }} </v-card-title>
        <v-card-text>
          <div v-show='uploadSettings.local.enabled'>
            <label>LOCAL: {{ uploadLocalSuccessCount }}/{{ imageFiles.length }}</label>
          </div>
          <div v-show='uploadSettings.ftp.enabled'>
            <label>FTP: {{ uploadFtpSuccessCount }}/{{ imageFiles.length }}</label>
          </div>
          <div v-show='uploadSettings.cloudinary.enabled'>
            <label>CLOUD: {{ uploadCloudSuccessCount }}/{{ imageFiles.length }}</label>
          </div>
          <ul>
            <li v-for='item in imageFiles' :key='item.name' class='mt-3' style='list-style: none'>
              <div>
                <strong> {{ item.name }}&nbsp;</strong>
              </div>
              <div v-show='uploadSettings.local.enabled'>
                Local Server
                <v-progress-circular v-show='item.uploadingLocal' :width='3' :size='20' color='primary'
                                     indeterminate></v-progress-circular>
                <span v-show='!item.uploadingLocal && item.uploadLocalSuccess'> <v-icon small color='green darken-2'> mdi-check-circle </v-icon></span>
                <span v-show='!item.uploadingLocal && !item.uploadLocalSuccess'> <v-icon small color='red darken-2'> mdi-error </v-icon></span>
                <!-- <div>
                  <strong>{{ item.localPath }}</strong>
                </div> -->
              </div>
              <div v-show="uploadSettings.cloudinary.enabled">
                Cloud
                <span v-show="!item.uploadingCloud && item.uploadCloudSuccess"> <v-icon small color="green darken-2"> mdi-check-circle </v-icon></span>
                <span v-show="!item.uploadingCloud && !item.uploadCloudSuccess"> <v-icon small color="red darken-2"> mdi-error </v-icon></span>
                <a v-show="!item.uploadingCloud && item.uploadCloudSuccess" target="_blank" v-bind:href="item.cloudUrl">{{ item.cloudUrl }}</a>
                <v-progress-circular v-show="item.uploadingCloud" :width="3" :size="20" color="primary" indeterminate></v-progress-circular>
              </div>
              <div v-show="uploadSettings.ftp.enabled">
                FTP
                <v-progress-circular v-show="item.uploadingFtp" :width="3" :size="20" color="primary" indeterminate></v-progress-circular>
                <span v-show="!item.uploadingFtp && item.uploadFtpSuccess"> <v-icon small color="green darken-2"> mdi-check-circle </v-icon></span>
                <span v-show="!item.uploadingFtp && !item.uploadFtpSuccess"> <v-icon small color="red darken-2"> mdi-error </v-icon></span>
                <!-- <div>
                  <strong>{{ item.ftpHost }}</strong>
                </div> -->
              </div>
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled='hideBackToHomePageButton' color='green darken-1' text @click='backToHomePage()'> Về trang
            chủ
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color='green darken-1' text @click='backToHomePage(true)'>Chụp Tiếp</v-btn>
          <v-spacer></v-spacer>
          <v-btn color='green darken-1' text @click='showProgressDialog = false'> Thoát</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showUploadSettingsDialog" persistent width="500" class="text-center" id="upload-settings-dialog">
      <v-card>
        <v-card-title class="headline"> Cấu hình Upload </v-card-title>
        <v-expansion-panels>
          <v-expansion-panel v-show="serverSettings.local.enabledLow || serverSettings.local.enabledHigh">
            <v-expansion-panel-header> Upload Local </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row justify="space-around" no-gutters>
                <v-col cols="12">
                  <v-switch v-model="uploadSettings.local.enabled" :label="uploadSettings.local.enabled ? 'Tắt' : 'Bật'"></v-switch>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-show="serverSettings.ftp.enabled">
            <v-expansion-panel-header> Upload FTP </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row justify="space-around" no-gutters>
                <v-col cols="12">
                  <v-switch v-model="uploadSettings.ftp.enabled" :label="uploadSettings.ftp.enabled ? 'Tắt' : 'Bật'"></v-switch>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-show="serverSettings.cloudinary.enabled">
            <v-expansion-panel-header> Upload Cloudinary </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row justify="space-around" no-gutters>
                <v-col cols="12">
                  <v-switch v-model="uploadSettings.cloudinary.enabled" :label="uploadSettings.cloudinary.enabled ? 'Tắt' : 'Bật'"></v-switch>
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
    <v-dialog v-model="showImagesCarousel" id="image-viewer" persistent class="text-center">
      <v-card>
        <v-carousel height="auto" ref="carousel" v-model="imageCarouselId">
          <v-carousel-item height="100%" v-for="(image, i) in imageElements" :key="i">
            <v-img contain :src="image.element.src" :lazy-src="image.element.src" class="image">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-carousel-item>
        </v-carousel>
        <v-card-actions>
          <v-btn color='green darken-1' text @click='deleteImage'> Xoá</v-btn>
          <v-spacer></v-spacer>
          <v-btn color='green darken-1' text @click='showImagesCarousel = false'> Thoát</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showFtpUploadedImagesCarousel" id="ftp-image-viewer" persistent class="text-center">
      <v-card>
        <v-row
            v-show='loadFtp'
            justify='center'
            style='padding: 32px'
        >
          <v-progress-circular :width='10' :size='50'
                               color='primary'
                               indeterminate></v-progress-circular>
        </v-row>
        <v-carousel height='auto' ref='ftp-carousel' v-model='ftpImageCarouselId'>
          <v-carousel-item height='100%' v-for='(image, i) in ftpUploadedImages' :key='i'>
            <v-img contain :src='image.element.src' :lazy-src='image.element.src' class='image'>
              <template v-slot:placeholder>
                <v-row class='fill-height ma-0' align='center' justify='center'>
                  <v-progress-circular indeterminate color='grey lighten-5'></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-carousel-item>
        </v-carousel>
        <v-card-actions>
          <v-row
              justify='end'
              style='padding: 8px'
          >
            <v-btn color='green darken-1' text @click='showFtpUploadedImagesCarousel = false'> Thoát</v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row v-show="!showImagesCarousel && !showContainerButtons" id="container-input">
      <v-col cols="12">
        <v-text-field
            label='Container ID'
            style='text-transform: uppercase'
            oninput='this.value = this.value.toUpperCase()'
            :rules='[rules.required, rules.equal]'
            outlined
            hide-details='auto'
            v-model='containerId'
        ></v-text-field>
      </v-col>
      <v-col cols='12'>
        <v-btn for='files' elevation='5' outlined rounded color='primary' v-on:click='inputContainer'>
          <v-icon dark left>mdi-camera</v-icon>
          Chụp
        </v-btn>
        <input v-show='false' type='file' ref='camera' multiple='multiple' id='camera' accept='image/*' capture='camera'
               v-on:change='onCapture' />
      </v-col>
    </v-row>
    <v-row v-show='showContainerButtons' id='buttons' class='ma-0'>
      <v-col sm='12' cols='12'> Đã chụp {{ imageElements.length }} ảnh</v-col>
      <v-col cols='12'>
        <v-btn for='files' elevation='5' outlined rounded color='primary' v-on:click='upload'>
          <v-icon dark left>mdi-cloud-upload</v-icon>
          GHI
        </v-btn>
      </v-col
      >
      <v-col cols='12'>
        <v-btn for='files' elevation='5' outlined rounded color='primary' v-on:click='downloadToLocal'>
          <v-icon dark left>mdi-cloud-upload</v-icon>
          LOCAL
        </v-btn>
      </v-col
      >
      <v-col cols='12'>
        <v-btn for='files' elevation='5' outlined rounded color='primary' v-on:click='onShowingContainerImages'>
          <v-icon dark left>mdi-file</v-icon>
          XEM
        </v-btn>
      </v-col>
      <v-col cols='12' v-show='uploadSettings.ftp.enabled'>
        <v-btn :disabled='!currentFtpPath' for='files' elevation='5' outlined rounded color='primary'
               v-on:click='onShowingFtpUploadedImages'>
          <v-icon dark left>mdi-file</v-icon>
          XEM FTP
        </v-btn>
      </v-col>
      <v-col cols='12'>
        <v-btn for='files' elevation='5' outlined rounded color='primary' v-on:click='showCamera'>
          <v-icon dark left>mdi-camera</v-icon>
          CHỤP
        </v-btn>
      </v-col>
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
