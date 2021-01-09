import moment from "moment";
import UploadService from "../../services/upload-service";
const uploadService = new UploadService();

export default {
  mounted() {
    if (!this.$cookies.isKey("user")) {
      this.$router.push("/login");
    }

    if (localStorage.getItem("uploadSettings")) {
      this.uploadSettings = JSON.parse(localStorage.getItem("uploadSettings"));
    }

    setInterval(() => {
      this.$forceUpdate();
    }, 1000);
  },
  name: "Home",
  data() {
    return {
      uploadSettings: {
        local: {
          enabled: true,
          ip: "",
        },
        ftp: {
          enabled: false,
          host: "",
          username: "",
          password: "",
        },
        cloudinary: {
          enabled: false,
          cloudName: "",
          apiKey: "",
          apiSecret: "",
        },
      },
      uploadSettingsTab: null,
      uploadLocal: null,
      uploadFTP: null,
      uploadCloud: null,
      containerId: "",
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 1 || "Min 1 characters",
      },
      viewPhotos: false,
      photoFiles: [],
      photos: [],
      carouselId: 0,
      showProgressDialog: false,
      showUploadSettingsDialog: false,
    };
  },
  methods: {
    showCamera() {
      if (this.containerId) {
        this.$refs.camera.click();
      }
    },

    onCapture() {
      this.viewPhotos = true;
      var file = this.$refs.camera.files[0];
      this.photoFiles.push({
        file,
        date: moment(),
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
      this.photoFiles.forEach(({ file, name, date }) => {
        if (this.uploadSettings.local.enabled) {
          uploadService.uploadLocalServer(file, name, date, (response) => {
            file.uploading = false;
            console.log(response.data);
          });
        }

        if (this.uploadSettings.ftp.enabled) {
          uploadService.uploadFTP(file, name, (response) => {
            const result = response.data;
            file.uploading = false;
            if (result.ftp.success) {
              file.uploadFtpSuccess = true;
            } else {
              file.uploadFtpSuccess = false;
            }
          });
        }

        if (this.uploadSettings.cloudinary.enabled) {
          uploadService.uploadCloud(file, name, (response) => {
            const result = response.data;
            file.uploading = false;
            if (result.cloud.success) {
              file.cloudUrl = result.cloud.url;
              file.uploadCloudSuccess = true;
            } else {
              file.uploadCloudSuccess = false;
            }
          });
        }
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

    closeUploadSettingsDialog() {
      this.showUploadSettingsDialog = false;
      localStorage.setItem(
        "uploadSettings",
        JSON.stringify(this.uploadSettings)
      );
    },
  },
};
