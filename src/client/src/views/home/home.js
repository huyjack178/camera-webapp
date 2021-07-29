import moment from 'moment';
import homeData from './data';
import UploadService from './services/upload-service';
import ContainerIdValidator from './utils/container-id-validator';
import ImageProcessor from './utils/image-processor';

const uploadService = new UploadService();
const imageProcessor = new ImageProcessor();
const containerIdValidator = new ContainerIdValidator();

export default {
  mounted() {
    if (!this.$cookies.isKey('token')) {
      this.$router.push('/login');
    }

    if (localStorage.getItem('uploadSettings')) {
      this.uploadSettings = JSON.parse(localStorage.getItem('uploadSettings'));
    }

    if (localStorage.getItem('serverSettings')) {
      this.serverSettings = JSON.parse(localStorage.getItem('serverSettings'));
    }

    if (localStorage.getItem('userName')) {
      this.userName = localStorage.getItem('userName');
    }

    if (localStorage.getItem('imageMaxSizes')) {
      this.imageMaxSizes = JSON.parse(localStorage.getItem('imageMaxSizes'));
    } else {
      this.imageMaxSizes = {
        high: 2100,
        low: 840,
      };
    }
  },
  name: 'Home',
  data() {
    return homeData.data;
  },
  methods: {
    inputContainer() {
      if (this.containerId && this.containerId.length == 11) {
        const isOk = containerIdValidator.validate(this.containerId);

        if (!isOk) {
          if (confirm('ISO Container chưa đúng. Bạn có muốn tiếp tục?')) {
            this.showCamera();
          } else {
            this.containerId = '';
          }
        } else {
          this.showCamera();
        }
      }

      if (!this.containerDate) {
        this.containerDate = moment();
      }
    },

    showCamera() {
      this.$refs.camera.click();
    },

    onCapture() {
      this.showContainerButtons = true;
      const file = this.$refs.camera.files[0];

      imageProcessor.processImage(
        file,
        this.imageMaxSizes,
        imageElement => {
          this.imageElements.push(imageElement);
          this.imageCarouselId = this.imageElements.length - 1;
        },
        (lowImageFile, highImageFile) => {
          this.imageFiles.push({
            files: { low: lowImageFile, high: highImageFile },
            date: this.containerDate,
            id: this.containerId,
            name: `${this.containerId}_${this.containerDate.format('YYMMDDHHmmss')}_${('0' + (this.imageFiles.length + 1)).slice(-2)}`,
          });
        }
      );
    },

    upload() {
      this.showProgressDialog = true;
      this.imageFiles.forEach(imageFile => {
        const filesData = imageFile.files;
        const fileName = imageFile.name;
        const fileDate = imageFile.date;
        const fileId = imageFile.id;

        this.uploadLocal(imageFile, filesData, fileId, fileName, fileDate, this.userName);
        this.uploadFTP(imageFile, filesData, fileId, fileName, fileDate, this.userName);
        this.updateCloudinary(imageFile, filesData, fileId, fileName);
      });

      const intervalId = setInterval(() => {
        if (this.imageFiles.every(file => this.uploadSuccess(file))) {
          this.uploadPopupTitle = 'Upload thành công';
          clearInterval(intervalId);
        }
      }, 1000);
    },

    uploadLocal(imageFile, files, fileId, fileName, fileDate, userName) {
      if (this.uploadSettings.local.enabled) {
        imageFile.uploadingLocal = true;

        if (this.serverSettings.local.enabledHigh) {
          this.uploadLocalHighResolution(files, fileId, fileName, fileDate, userName, imageFile);
        } else {
          this.uploadLocalLowResolution(files, fileId, fileName, fileDate, userName, imageFile);
        }
      }
    },

    uploadLocalHighResolution(files, fileId, fileName, fileDate, userName, imageFile) {
      uploadService.uploadLocalServer({ file: files.high, fileId, fileName, fileDate, userName, isHighResolution: true }, highResponse => {
        if (this.isUnauthorized(highResponse)) {
          return;
        }

        if (this.serverSettings.local.enabledLow) {
          this.uploadLocalLowResolution(files, fileId, fileName, fileDate, userName, imageFile);
        } else {
          this.handleUploadLocalResponse(highResponse, imageFile);
        }
      });
    },

    uploadLocalLowResolution(files, fileId, fileName, fileDate, userName, imageFile) {
      uploadService.uploadLocalServer({ file: files.low, fileId, fileName, fileDate, userName }, lowResponse => {
        if (this.isUnauthorized(lowResponse)) {
          return;
        }

        this.handleUploadLocalResponse(lowResponse, imageFile);
      });
    },

    handleUploadLocalResponse(response, imageFile) {
      const result = response.data;
      imageFile.uploadingLocal = false;

      if (result.local.success) {
        imageFile.localPath = result.local.path;
        imageFile.uploadLocalSuccess = true;
      } else {
        imageFile.uploadLocalSuccess = false;
      }

      this.$forceUpdate();
    },

    uploadFTP(imageFile, files, fileId, fileName, fileDate, userName) {
      if (this.uploadSettings.ftp.enabled) {
        imageFile.uploadingFtp = true;
        uploadService.uploadFTP({ file: files.low, fileId, fileName, fileDate, userName }, response => {
          if (this.isUnauthorized(response)) {
            return;
          }
          const result = response.data;
          imageFile.uploadingFtp = false;

          if (result.ftp.success) {
            imageFile.ftpHost = result.ftp.host;
            imageFile.uploadFtpSuccess = true;
          } else {
            imageFile.uploadFtpSuccess = false;
          }

          this.$forceUpdate();
        });
      }
    },

    updateCloudinary(imageFile, files, fileId, fileName) {
      if (this.uploadSettings.cloudinary.enabled) {
        imageFile.uploadingCloud = true;
        uploadService.uploadCloud({ file: files.low, fileId, fileName }, response => {
          if (this.isUnauthorized(response)) {
            return;
          }
          const result = response.data;
          imageFile.uploadingCloud = false;

          if (result.cloud.success) {
            imageFile.cloudUrl = result.cloud.url;
            imageFile.uploadCloudSuccess = true;
          } else {
            imageFile.uploadCloudSuccess = false;
          }

          this.$forceUpdate();
        });
      }
    },

    onShowingContainerImages() {
      if (this.imageElements.length == 0) {
        alert('Không có hình để xem');
        return;
      }

      this.showImagesCarousel = true;
    },

    deleteImage() {
      this.imageFiles.splice(this.imageCarouselId, 1);
      this.imageElements.splice(this.imageCarouselId, 1);

      if (this.imageElements.length == 0) {
        this.showImagesCarousel = false;
      }
    },

    backToHomePage() {
      this.containerId = '';
      this.showProgressDialog = false;
      this.showImagesCarousel = false;
      this.showContainerButtons = false;
      this.imageFiles = [];
      this.imageElements = [];
      this.containerDate = '';
      this.uploadPopupTitle = 'Đang Upload ....';
    },

    closeUploadSettingsDialog() {
      this.showUploadSettingsDialog = false;
      const serverSettings = JSON.parse(localStorage.getItem('serverSettings'));
      this.uploadSettings.ftp.enabled = this.uploadSettings.ftp.enabled && serverSettings.ftp.enabled;
      this.uploadSettings.cloudinary.enabled = this.uploadSettings.cloudinary.enabled && serverSettings.cloudinary.enabled;
      localStorage.setItem('uploadSettings', JSON.stringify(this.uploadSettings));
    },

    isUnauthorized(response) {
      if (response.status == 401) {
        this.$router.push('/login');

        return true;
      }

      return false;
    },

    logout() {
      this.$cookies.remove('token');
      this.$router.push('/login');
    },

    uploadSuccess(file) {
      let result = false;

      if (this.uploadSettings.local.enabled) {
        result = file.uploadLocalSuccess;
      }

      if (this.uploadSettings.ftp.enabled) {
        result = result && file.uploadFtpSuccess;
      }

      if (this.uploadSettings.cloudinary.enabled) {
        result = result && file.uploadCloudSuccess;
      }

      return result;
    },
  },
};
