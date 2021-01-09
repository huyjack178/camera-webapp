import moment from 'moment';
import UploadService from '../../services/upload-service';
const uploadService = new UploadService();

export default {
  mounted() {
    if (!this.$cookies.isKey('user')) {
      this.$router.push('/login');
    }

    if (localStorage.getItem('uploadSettings')) {
      this.uploadSettings = JSON.parse(localStorage.getItem('uploadSettings'));
    }

    setInterval(() => {
      this.$forceUpdate();
    }, 1000);
  },
  name: 'Home',
  data() {
    return {
      uploadSettings: {
        local: {
          enabled: true,
          ip: '',
        },
        ftp: {
          enabled: false,
          host: '',
          username: '',
          password: '',
        },
        cloudinary: {
          enabled: false,
          cloud_name: '',
          api_key: '',
          api_secret: '',
        },
      },
      containerId: '',
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 1 || 'Min 1 characters',
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
        name: `${this.containerId}_${moment().format('YYMMDDhhmmss')}_${this.photoFiles.length + 1}`,
      });
      this.photos.push(this.readPhotoFile(file));
      this.carouselId = this.photoFiles.length - 1;
    },

    upload() {
      this.showProgressDialog = true;
      this.photoFiles.forEach(photoFile => {
        const fileContent = photoFile.file;
        const fileName = photoFile.name;
        const fileDate = photoFile.date;

        if (this.uploadSettings.local.enabled) {
          photoFile.uploadingLocal = true;
          uploadService.uploadLocalServer(fileContent, fileName, fileDate, this.uploadSettings.local.ip, response => {
            const result = response.data;
            photoFile.uploadingLocal = false;

            if (result.local.success) {
              photoFile.localPath = result.local.path;
              photoFile.uploadLocalSuccess = true;
            } else {
              photoFile.uploadLocalSuccess = false;
            }
          });
        }

        if (this.uploadSettings.ftp.enabled) {
          photoFile.uploadingFtp = true;
          uploadService.uploadFTP(fileContent, fileName, this.uploadSettings.ftp, response => {
            const result = response.data;
            photoFile.uploadingFtp = false;

            if (result.ftp.success) {
              photoFile.ftpHost = result.ftp.host;
              photoFile.uploadFtpSuccess = true;
            } else {
              photoFile.uploadFtpSuccess = false;
            }
          });
        }

        if (this.uploadSettings.cloudinary.enabled) {
          photoFile.uploadingCloud = true;
          uploadService.uploadCloud(fileContent, fileName, this.uploadSettings.cloudinary, response => {
            const result = response.data;
            photoFile.uploadingCloud = false;

            if (result.cloud.success) {
              photoFile.cloudUrl = result.cloud.url;
              photoFile.uploadCloudSuccess = true;
            } else {
              photoFile.uploadCloudSuccess = false;
            }
          });
        }
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
      this.showProgressDialog = false;
      this.viewPhotos = false;
      this.photoFiles = [];
      this.photos = [];
    },

    closeUploadSettingsDialog() {
      this.showUploadSettingsDialog = false;
      localStorage.setItem('uploadSettings', JSON.stringify(this.uploadSettings));
    },
  },
};
