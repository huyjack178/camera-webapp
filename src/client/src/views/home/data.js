export default {
  get data() {
    return {
      rules: {
        required: value => !!value || 'Required.',
        equal: v => v.length == 11 || 'Equals 11 characters',
      },
      uploadSettings: {
        local: {
          enabled: true,
          ip: '',
        },
        ftp: {
          enabled: true,
          host: '',
          username: '',
          password: '',
        },
        cloudinary: {
          enabled: true,
          cloud_name: '',
          api_key: '',
          api_secret: '',
        },
      },
      serverSettings: {
        local: {},
        ftp: {
          enabled: false,
        },
        cloudinary: {
          enabled: false,
        },
      },
      containerId: '',
      containerDate: '',
      imageFiles: [],
      imageElements: [],
      ftpUploadedImages: [],
      imageCarouselId: 0,
      ftpImageCarouselId: 0,
      showImagesCarousel: false,
      showContainerButtons: false,
      showProgressDialog: false,
      showUploadSettingsDialog: false,
      showFtpUploadedImagesCarousel: false,
      uploadPopupTitle: 'Đang Upload ....',
      uploadLocalSuccessCount: 0,
      uploadFtpSuccessCount: 0,
      uploadCloudSuccessCount: 0,
      hideBackToHomePageButton: true
    };
  },
};
