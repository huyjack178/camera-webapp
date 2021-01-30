import LoginService from '../../services/login-service';
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
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
      },
    };
  },
  methods: {
    login() {
      loginService.login(this.username, this.password, response => {
        if (response.status != 200) {
          this.showLoginError = true;
          setTimeout(() => (this.showLoginError = false), 1000);
        } else {
          const token = response.data.token;
          this.$cookies.set('token', token, '1d');
          localStorage.setItem('userName', this.username);
          localStorage.setItem('imageMaxSizes', response.data.imageMaxSizes);
          this.$router.push({ name: 'Home', path: '/' });
        }
      });
    },
  },
};
