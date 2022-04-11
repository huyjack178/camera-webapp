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
      imageCarouselId: 0,
      showImagesCarousel: false,
      showContainerButtons: false,
      showProgressDialog: false,
      showUploadSettingsDialog: false,
      uploadPopupTitle: 'Đang Upload ....',
    };
  },
};
