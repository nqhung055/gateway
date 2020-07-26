<template>
	<div class="session-wrapper">
		<div class="session-left">
			<session-slider-widget></session-slider-widget>
		</div>
		<div class="session-right text-center">
			<div class="session-table-cell">
				<div class="session-content">
					<img 
						:src="appLogo"
						class="img-responsive mb-4" 
						width="78" 
						height="78" 
					/>
					<h2 class="mb-4">{{$t('message.gateway')}}</h2>
					<p class="fs-14">{{$t('message.gatewayLoginNotice')}}</p>
					<v-form v-model="valid" class="mb-5">
						<v-text-field 
							label="E-mail ID" 
							v-model="username"
							required
						></v-text-field>
						<v-text-field 
							label="Password" 
							v-model="password" 
							type="password"
							required
						></v-text-field>
						<div>
							<v-btn large @click="login" block color="primary" class="mb-2">{{$t('message.loginNow')}}</v-btn>
						</div>
					</v-form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// import firebase from "firebase/app";
// import { mapGetters } from "vuex";
import SessionSliderWidget from "Components/Widgets/SessionSlider";
import AppConfig from "Constants/AppConfig";
import Vue from 'vue';

// const { login, logout, authenticated, authNotifier } = auth;

export default {
  components: {
    SessionSliderWidget
  },
  data() {
    return {
      checkbox: false,
      valid: false,
      username: "admin",
      password: "admin",
      appLogo: AppConfig.appLogo2,
      brand: AppConfig.brand
    };
  },
  methods: {
    async login() {
      const user = {
        username: this.username,
        password: this.password
      };
      const loginResult = await this.$axios.post('/login', user)
      
      if (loginResult.status === 200) {
        const { data } = loginResult
        localStorage.setItem('jwt', data)
        localStorage.setItem('user', JSON.stringify(user))
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + data
        this.$router.push("/dashboard/device")
        Vue.notify({
          group: 'loggedIn',
          type: 'success',
          text: 'Login successful!'
        })
      } 
      else {
        Vue.notify({
          group: 'loggedIn',
          type: 'error',
          text: 'Login fail. Please check your username and password!'
        })
      }
    }
  }
};
</script>
