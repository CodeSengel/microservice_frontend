<template>
  <q-page class="flex flex-center">
    UserPortfolio {{ platformListSupported }}
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default defineComponent({
  name: "UserPortfolio",

  setup() {
    const router = useRouter();
    //const url = `http://localhost:${ process.env.GATEWAY_PORT}`
    const url = process.env.GATEWAY_URL;
    const isLoggedIn = ref(false);
    let accessToken = null;
    let refreshToken = null;

    const platformListSupported = ref([]);

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

    const getPlatformList = async () => {
      /*
      const temp = await axios.get(`${url}/platformlist`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          RefreshToken: refreshToken,
        },
      });*/

      return temp;
    };

    const checkIfUSerIsConnected = async () => {
      console.log("on est entrain d appeler ", checkIfUSerIsConnected);
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
        console.log("NAghghghgh daaaa");

        const temp = await getPlatformList();

        platformListSupported.value = temp.data.data;
        console.log(temp.data.data);
      }
    });

    return {
      platformListSupported,
    };
  },
});
</script>
