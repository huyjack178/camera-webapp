export default {
  get data() {
    return {
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 1 || 'Min 1 characters',
      },
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
      containerDate: '',
      imageFiles: [],
      imageElements: [],
      imageCarouselId: 0,
      showImagesCarousel: false,
      showProgressDialog: false,
      showUploadSettingsDialog: false,
    };
  },
};
