<template>
  <q-page padding>
    <div class="login-page-container row flex flex-center">
      <div class="login-form col-xs-8 col-sm-6">
        <h5 class="login-title">Login</h5>
        <q-form @submit.prevent="" class="q-gutter-xs">
          <q-input
            outlined
            v-model="form.email"
            label="Email"
            type="email"
            dense
            clearable
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Email is required']"
          />
          <q-input
            outlined
            v-model="form.password"
            label="Mot de passe"
            type="password"
            dense
            clearable
            :rules="[
              (val) => (val && val.length >= 6) || 'Minimum 6 characters',
            ]"
          />
          <q-card-actions class="q-px-md full-wdth flex flex-center">
            <q-btn
              unelevated
              glossy
              dense
              color="purple-5"
              size="lg"
              class=""
              type="submit"
              label="Login"
              @click="login()"
            />
          </q-card-actions>

          <q-card-actions align="center" class="row col-12">
            <q-btn
              unelevated
              dense
              outline
              size="lg"
              class="col-2"
              type="submit"
              @click="handleRegister"
              :color="$q.dark.isActive ? 'white' : 'dark'"
            >
              <div class="flex flex-center" style="width: 50%; height: 50%">
                <img
                  src="~assets/discord-mark-blue.svg"
                  alt="Discord Logo"
                  style="max-width: 100%; max-height: 80%"
                />
              </div>
            </q-btn>

            <q-btn
              unelevated
              dense
              outline
              size="lg"
              class="col-2"
              type="submit"
              @click="handleRegister"
              :color="$q.dark.isActive ? 'white' : 'dark'"
            >
              <div class="flex flex-center" style="width: 50%; height: 50%">
                <img
                  src="~assets/googleLogo.png"
                  alt="Google Logo"
                  style="max-width: 76%; max-height: 80%"
                />
              </div>
            </q-btn>
          </q-card-actions>
        </q-form>
        <p class="text-center q-mt-lg">
          You don't have an account yet
          <router-link to="/register"> Sign up</router-link>
        </p>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import useNotify from "src/composables/UseNotify";
import { useRouter } from "vue-router";
import axios from "axios";

export default defineComponent({
  name: "LoginPage",

  setup() {
    let accessToken = null;
    let refreshToken = null;

    const getTokensFromCookies = () => {
      try {
        accessToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("my-access-token="))
          .split("=")[1];
        refreshToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("my-refresh-token="))
          .split("=")[1];
      } catch (error) {
        //router.push({ name: "login" });
      }
    };

    const router = useRouter();
    const { notifyError, notifySuccess } = useNotify();

    //const url = `http://localhost:${ process.env.GATEWAY_PORT}`
    const url = process.env.GATEWAY_URL;
    const isLoggedIn = ref(false);

    const form = ref({
      email: "",
      password: "",
    });

    // Fonction pour définir un cookie
    const setCookie = (name, value, days) => {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax; secure`;
    };

    const login = async () => {
      try {
        console.log("login débuté ");
        const data = await axios.post(`${url}/login`, form.value);
        console.log("login passé ", data);
        // Stocker les tokens dans les cookies avec une durée de validité
        setCookie("my-access-token", data.data.tokens.accesstoken, 30); // par exemple, 30 jours de validité
        setCookie("my-refresh-token", data.data.tokens.refreshtoken, 30); // par exemple, 30 jours de validité
        router.push({ name: "userprofil" });
        notifySuccess("welcome");
      } catch (error) {
        notifyError(error.code);
      }
    };

    onMounted(async () => {
      await getTokensFromCookies();
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
      try {
        isLoggedIn.value = await axios.get(`${url}/isloggedin`);
      } catch (error) {
        console.log(error.code);
        notifyError(error.code);
      }

      if (
        isLoggedIn.value.data.isloggedin &&
        accessToken !== null &&
        refreshToken !== null
      ) {
        router.push({ name: "userprofil" });
      }
    });

    return {
      form,
      login,
    };
  },
});
</script>
