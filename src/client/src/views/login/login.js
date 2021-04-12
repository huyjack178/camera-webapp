import LoginService from './services/login-service';
const loginService = new LoginService();

export default {
  mounted() {
    if (this.$cookies.isKey('user')) {
      this.$router.push('/');
    }
  },
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      showLoginError: false,
      loginErrorResponse: '',
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 4 || 'Min 4 characters',
      },
    };
  },
  methods: {
    login() {
      loginService.login(this.username, this.password, response => {
        if (response.status != 200) {
          this.showLoginError = true;
          this.loginErrorResponse = response.data;
          setTimeout(() => (this.showLoginError = false), 1000);
        } else {
          const token = response.data.token;
          this.$cookies.set('token', token, '1d');
          localStorage.setItem('userName', this.username);
          localStorage.setItem('imageMaxSizes', response.data.imageMaxSizes);
          localStorage.setItem('serverSettings', response.data.settings);

          this.adjustUploadSettings(response);

          this.$router.push({ name: 'Home', path: '/' });
        }
      });
    },

    adjustUploadSettings(response) {
      if (localStorage.getItem('uploadSettings')) {
        const uploadSettings = JSON.parse(localStorage.getItem('uploadSettings'));
        const serverSettings = JSON.parse(response.data.settings);
        uploadSettings.ftp.enabled = uploadSettings.ftp.enabled && serverSettings.ftp.enabled;
        uploadSettings.cloudinary.enabled = uploadSettings.cloudinary.enabled && serverSettings.cloudinary.enabled;
        localStorage.setItem('uploadSettings', JSON.stringify(uploadSettings));
      }
    },
  },
};
