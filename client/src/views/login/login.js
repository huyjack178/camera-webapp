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
      if (this.username == 'admin' && this.password == '1234aaAA') {
        this.$cookies.set('user', 'admin', '1h');
        this.$router.push({ name: 'Home', path: '/' });
      } else {
        this.showLoginError = true;
        setTimeout(() => (this.showLoginError = false), 1000);
      }
    },
  },
};
