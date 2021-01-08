<template>
  <v-container
    fluid
    fill-height
    class="text-center justify-center align-center"
  >
    <v-row>
      <v-col cols="12">
        <v-alert
          transition="scale-transition"
          dense
          outlined
          type="error"
          v-show="showLoginError"
        >
          Username hoặc password chưa đúng.<br />
          Vui lòng thử lại!
        </v-alert>
      </v-col>
      <v-col cols="12">
        <v-card
          max-width="500"
          elevation="2"
          class="mx-auto pa-6"
          outlined
          shaped
        >
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Username"
                :rules="[rules.required]"
                hide-details="auto"
                outlined
                v-model="username"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="showPassword ? 'text' : 'password'"
                hide-details="auto"
                hint="At least 8 characters"
                outlined
                counter
                v-model="password"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn
                for="files"
                elevation="5"
                outlined
                rounded
                color="primary"
                v-on:click="login"
              >
                Đăng Nhập
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
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
        required: (value) => !!value || 'Required.',
        min: (v) => v.length >= 8 || 'Min 8 characters',
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
</script>
