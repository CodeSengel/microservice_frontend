<template>
  <q-page class="flex flex-center"> USER FROFIL </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default defineComponent({
  name: "UserProfil",

  setup() {
    const router = useRouter();
    const url = `http://localhost:${process.env.GATEWAY_PORT}`;
    const isLoggedIn = ref(false);
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

    const checkIfUSerIsConnected = async () => {
      console.log("on va voir s'il sont connecté");
      await getTokensFromCookies();
      isLoggedIn.value = await axios.get(`${url}/isloggedin`);
      console.log(isLoggedIn.value.data.isloggedin);
      console.log(accessToken);
      console.log(refreshToken);
      if (
        !isLoggedIn.value.data.isloggedin ||
        accessToken == null ||
        refreshToken == null
      ) {
        return false;
      } else {
        return true;
      }
    };

    onMounted(async () => {
      const temp = await checkIfUSerIsConnected();
      console.log("temp", temp);
      if (!temp) {
        router.push({ name: "login" });
      } else {
      }
    });

    return {};
  },
});
</script>
