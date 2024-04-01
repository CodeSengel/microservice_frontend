<template>
  <q-page padding>
    <div v-if="myPublicKeyList.length === 0">
      <p class="text-h6">Vous n'avez pas encore connecté de compte</p>
    </div>
    {{ report }}
    <div class="row row">
      <q-card class="col-12 row">
        <div class="col-10 justify-start">
          <p class="text-h6">Liste de vos comptes connectés</p>
        </div>
        <div class="col-2 flex flex-center">
          <q-div class="justify-end col-2">
            <q-btn
              @click="getDataFromConnectedPlatform()"
              icon="mdi-update"
              color="primary"
              size="10px"
            />
          </q-div>
        </div>
      </q-card>

      <div class="col-12 q-my-lg">
        <q-badge
          class="justify-center col-2 q-mr-xs"
          v-for="item in myPublicKeyList"
          :key="item"
        >
          <div v-for="i in platformListSupported[0]" :key="i">
            <div v-for="k in i" :key="k">
              <q-avatar
                v-if="k.label == item.platform"
                color="white"
                style="border: 1px solid black"
                text-color="white"
                size="40px"
                font-size="82px"
              >
                <q-img
                  class="q-ma-xs zoomed-image"
                  :src="k.icon_link"
                  style="position: relative"
                >
                </q-img>
              </q-avatar>
            </div>
          </div>
          <div class="q-ml-xs">{{ item.name }}</div>
        </q-badge>
      </div>
    </div>
    UserPortfolio {{ myPublicKeyList }} sss
    {{ platformListSupported[0] }}
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import saveKey from "src/composables/SaveKey";

export default defineComponent({
  name: "UserPortfolio",

  setup() {
    const dataFromConnectedPlatform = ref({});
    const report = ref([]);
    const { getCollectionData } = saveKey();
    const myPublicKeyList = ref([]);
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

    const getDataFromConnectedPlatform = () => {
      console.log(
        "je dois du coup récupére des données des platform connectées",
        myPublicKeyList.value.length
      );

      myPublicKeyList.value.forEach(async (element) => {
        if (element.platform != "BITPANDA") {
          report.value.push(
            "la platform",
            element.platform,
            " n'est pas encore disponible"
          );
        } else {
          console.log(
            "voici l url ",
            `${element.platform.toLowerCase()}getdata`
          );
          dataFromConnectedPlatform.value[element.platform] = await axios.get(
            `${url}/${element.platform.toLowerCase()}getdata`,
            {
              headers: {
                Key: JSON.stringify({ "x-api-key": element.key }),
              },
            }
          );
        }
        if (element.platform == "BITPANDA") {
          report.value.push(
            "la platform",
            element.platform,
            " ne fournit pas de détail sur vos staking, merci de rajouter l'historique manuellement"
          );
        }
      });
    };

    onMounted(async () => {
      const temp = await checkIfUSerIsConnected();
      console.log("temp", temp);
      if (!temp) {
        router.push({ name: "login" });
      } else {
        console.log("je dois récupere les platform supporte");
        platformListSupported.value = await getCollectionData(
          "Supported_Platforms_List"
        );
        myPublicKeyList.value = await getCollectionData("Key_List", {
          connected: true,
        });

        console.log("voic les supporte", platformListSupported.value[0].data);
        console.log("voic les miennes", myPublicKeyList.value);
      }
    });

    return {
      myPublicKeyList,
      platformListSupported,
      getDataFromConnectedPlatform,
      report,
    };
  },
});
</script>

<style>
.zoomed-image {
  transform: scale(1.3); /* Ajustez la valeur de l'échelle selon vos besoins */
}
</style>
