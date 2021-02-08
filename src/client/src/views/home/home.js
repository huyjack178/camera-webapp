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
    showCamera() {
      if (this.containerId) {
        const isOk = containerIdValidator.validate(this.containerId);
        console.log(isOk);
        if (!isOk) {
          if (confirm('ISO Container chưa đúng. Bạn có muốn tiếp tục?')) {
            this.$refs.camera.click();
          } else {
            this.containerId = '';
          }
        } else {
          this.$refs.camera.click();
        }
      }

      if (!this.containerDate) {
        this.containerDate = moment();
      }
    },

    onCapture() {
      this.showImagesCarousel = true;
      const file = this.$refs.camera.files[0];

      imageProcessor.processImage(
        file,
        this.imageMaxSizes,
        imageElement => {
          this.imageElements.push(imageElement);
          this.imageCarouselId = this.imageElements.length - 1;

          setTimeout(() => {
            this.$forceUpdate();
          }, 500);
        },
        (lowImageFile, highImageFile) => {
          this.imageFiles.push({
            files: { low: lowImageFile, high: highImageFile },
            date: this.containerDate,
            id: this.containerId,
            name: `${this.containerId}_${this.containerDate.format('YYMMDDHHmmss')}_${this.imageFiles.length + 1}`,
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
        this.uploadFTP(imageFile, filesData, fileId, fileName);
        this.updateCloudinary(imageFile, filesData, fileId, fileName);
      });

      const intervalId = setInterval(() => {
        if (this.imageFiles.every(file => file.uploadLocalSuccess && file.uploadFtpSuccess && file.uploadCloudSuccess)) {
          this.uploadPopupTitle = 'Upload thành công';
          clearInterval(intervalId);
        }
      }, 1000);
    },

    uploadLocal(imageFile, files, fileId, fileName, fileDate, userName) {
      if (this.uploadSettings.local.enabled) {
        imageFile.uploadingLocal = true;
        uploadService.uploadLocalServer({ file: files.high, fileId, fileName, fileDate, userName, isHighResolution: true }, highResponse => {
          if (this.isUnauthorized(highResponse)) {
            return;
          }

          uploadService.uploadLocalServer({ file: files.low, fileId, fileName, fileDate, userName }, lowResponse => {
            const result = lowResponse.data;
            imageFile.uploadingLocal = false;

            if (result.local.success) {
              imageFile.localPath = result.local.path;
              imageFile.uploadLocalSuccess = true;
            } else {
              imageFile.uploadLocalSuccess = false;
            }

            this.$forceUpdate();
          });
        });
      }
    },

    uploadFTP(imageFile, files, fileId, fileName) {
      if (this.uploadSettings.ftp.enabled) {
        imageFile.uploadingFtp = true;
        uploadService.uploadFTP({ file: files.low, fileId, fileName }, response => {
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

    deleteImage() {
      this.imageFiles.splice(this.imageCarouselId, 1);
      this.imageElements.splice(this.imageCarouselId, 1);

      if (this.imageElements.length == 0) {
        this.backToHomePage();
      }
    },

    backToHomePage() {
      this.containerId = '';
      this.showProgressDialog = false;
      this.showImagesCarousel = false;
      this.imageFiles = [];
      this.imageElements = [];
      this.containerDate = '';
    },

    closeUploadSettingsDialog() {
      this.showUploadSettingsDialog = false;
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
  },
};
