<template>
  <v-container>
    <v-dialog persistent width="500" class="text-center">
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
export default {
  props: {
    photoFiles: [],
  },
};
</script>
