<template>
  <q-page padding class="row justify-center">
    <div class="q-pa-md q-mt-md col-xs-12 col-md-10">
      <div class="justify-start q-gutter-xs row">
        <q-card class="col-12">
          <q-card-section class="justify-end row">
            <q-btn
              @click="addNewKey()"
              label="ajouter un nouveau compte"
              icon="add"
              color="primary"
            />
            <q-dialog v-model="dialogForNewKeyCreation">
              <div style="max-width: 400px">
                <q-card-section
                  class="col-12"
                  :class="
                    $q.dark.isActive
                      ? 'bg-dark text-white'
                      : 'bg-white text-dark'
                  "
                >
                  <q-form class="q-gutter-xs" @submit.prevent="saveNewKey">
                    <q-input
                      v-model="newPublicKey.name"
                      outlined
                      label="Name"
                      type="text"
                      dense
                      clearable
                      lazy-rules
                      :rules="[
                        (val) => (val && val.length > 0) || 'Name is required',
                      ]"
                    />
                    <div class="q-gutter-y-md column">
                      <q-select
                        standout="bg-primary text-white"
                        outlined
                        v-model="newPublicKey.platform"
                        :options="platformSupportedOption"
                        label="Platform"
                        dense
                        menu-anchor="bottom left"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length > 0) || 'Platform is required',
                        ]"
                      />
                    </div>

                    <q-input
                      v-model="newPublicKey.key"
                      outlined
                      label="Public key"
                      :type="isPwd ? 'password' : 'text'"
                      dense
                      clearable
                      lazy-rules
                      :rules="[
                        (val) => (val && val.length > 0) || 'Name is required',
                      ]"
                    >
                      <template v-slot:append>
                        <q-icon
                          :name="isPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="isPwd = !isPwd"
                        />
                      </template>
                    </q-input>
                    <q-input
                      v-if="newPublicKey.platform == 'BINANCE'"
                      v-model="newPublicKey.secretKey"
                      outlined
                      label="Secret key"
                      :type="isPwd ? 'password' : 'text'"
                      dense
                      clearable
                      lazy-rules
                      :rules="[
                        (val) => (val && val.length > 0) || 'Name is required',
                      ]"
                    >
                      <template v-slot:append>
                        <q-icon
                          :name="isPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="isPwd = !isPwd"
                        />
                      </template>
                    </q-input>

                    <div class="justify-end row">
                      <q-btn
                        :disable="
                          !newPublicKey.name ||
                          !newPublicKey.platform ||
                          !newPublicKey.key
                        "
                        label="Save"
                        type="submit"
                        color="primary"
                      />
                    </div>
                  </q-form>
                </q-card-section>
                <q-card-section class="col-12">
                  <span
                    >il faut savoir que nous stockons pas vos clés sur nos
                    serveurs,sauf si vous le demandez</span
                  >
                </q-card-section>
              </div>
            </q-dialog>
          </q-card-section>
        </q-card>
        <div v-if="myPublicKeyList.length === 0">
          <p class="text-h6">Vous n'avez pas encore ajouté de compte</p>
        </div>
        <q-card v-else class="col-12">
          <div class="q-pa-md q-gutter-md col-12">
            <q-list
              bordered
              padding
              class="rounded-borders"
              v-for="item in myPublicKeyList"
              :key="item"
            >
              <q-item>
                <div class="row col-10">
                  <q-item-section avatar top>
                    <div v-for="i in platformListSupported.data.data" :key="i">
                      <q-avatar
                        v-if="i.label == item.platform"
                        color="white"
                        style="border: 2px solid black"
                        text-color="white"
                        size="100px"
                        font-size="82px"
                      >
                        <q-img
                          class="q-ma-xs zoomed"
                          :src="i.icon_link"
                          style="position: relative"
                        >
                        </q-img>
                      </q-avatar>
                    </div>
                  </q-item-section>

                  <q-item-section class="col-5">
                    <q-item-label lines="1">{{ item.name }}</q-item-label>
                    <q-item-label caption>
                      created : {{ item.created_at }}</q-item-label
                    >
                  </q-item-section>
                </div>
                <div class="col-2">
                  <q-item-section class="col-2 row justify-end">
                    <q-btn
                      @click="setKeyConnexion(item)"
                      dense
                      :class="item.connected ? 'notanimated' : 'animated'"
                    >
                      <q-icon
                        color="black"
                        size="20px"
                        :name="
                          item.connected
                            ? 'mdi-transit-connection-horizontal'
                            : 'mdi-connection'
                        "
                      />
                    </q-btn>
                  </q-item-section>
                </div>
              </q-item>
              <div class="col-12 row">
                <div v-if="hidekey.name != item.name" class="col-10 row">
                  <q-btn
                    flat
                    icon="mdi-eye-off"
                    class="col-1"
                    @click="hidekeyFunc(item.name)"
                  />
                  <span
                    class="col-10"
                    style="
                      display: flex;
                      align-items: center;
                      overflow-x: auto;
                      white-space: nowrap;
                      text-align: left;
                    "
                  >
                    ****************************
                  </span>
                </div>
                <div v-else class="col-10 row">
                  <q-btn
                    icon="mdi-eye"
                    class="col-1"
                    @click="hidekeyFunc('')"
                  />
                  <span
                    class="col-10"
                    style="
                      display: flex;
                      align-items: center;
                      overflow-x: auto;
                      white-space: nowrap;
                      text-align: left;
                    "
                  >
                    {{ item.key }}</span
                  >
                </div>

                <div class="col-2 row justify-end">
                  <q-btn
                    flat
                    icon="mdi-delete"
                    class="col-2 text-red"
                    @click="deletKeyFunc(item)"
                  />
                </div>
              </div>
            </q-list>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useQuasar } from "quasar";

//import Localbase from "localbase";

import saveKey from "src/composables/SaveKey";

import useNotify from "src/composables/UseNotify";

export default defineComponent({
  name: "UserPortfolio",

  setup() {
    const $q = useQuasar();
    const { notifyError, notifySuccess } = useNotify();
    const router = useRouter();
    const {
      checkCollectionfunction,
      resetDb,
      getCollectionData,
      addObjectIfNotExists,
      deleteDocsByKeyValue,
      updateValue,
    } = saveKey();
    const url = process.env.GATEWAY_URL;
    const isLoggedIn = ref(false);
    let accessToken = null;
    let refreshToken = null;

    const platformListSupported = ref([]);
    const myPublicKeyList = ref([]);
    const dialogForNewKeyCreation = ref(false);
    const platformSupportedOption = ref([]);

    const isPwd = ref(true);
    const hidekey = ref({ name: "" });

    const newPublicKey = ref({
      name: "",
      platform: "",
      key: "",
      secretKey: "",
      icon_link: "",
      connected: false,
      created_at: "",
    });

    const hidekeyFunc = (item) => {
      hidekey.value.name = item;
    };

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

    const getPlatformList = async () => {
      console.log("là je dois appeler !!!!!! et surtout utliser ", url);
      const temp = await axios.get(`${url}/platformlistpublic`, {});

      return temp;
    };

    const addNewKey = () => {
      dialogForNewKeyCreation.value = true;
      console.log("add new key ");
    };
    const saveNewKey = async () => {
      console.log("je vais sauvegrader", newPublicKey);

      newPublicKey.value.created_at = new Date();
      const temp = await addObjectIfNotExists(
        "Key_List",
        "platform",
        newPublicKey.value.platform,
        newPublicKey.value
      );

      if (temp) {
        console.log("je nettoie tout");
        notifySuccess("la nouvelle clé a été créée avec succès");
        getMyPlatformList();
        dialogForNewKeyCreation.value = false;
        newPublicKey.value = {
          name: "",
          platform: "",
          key: "",
          secretKey: "",
          icon_link: "",
          created_at: "",
        };
      } else {
        notifyError(
          "il existe déjà une clé connecté à la plateforme " +
            newPublicKey.value.platform +
            " , veuillez la supprimer d'abord"
        );
      }
    };

    const formatDate = (date) => {
      return format(date, "MMMM do, yyyy");
    };

    const deletKeyFunc = async (item) => {
      console.log("je dois supprimer ça", item);
      $q.dialog({
        title: "Confirmer",
        message:
          "Vous voulez vraiment le supprimer la clé liée à votre compte " +
          item.platform +
          " ?",
        cancel: true,
        persistent: true,
      })
        .onOk(async () => {
          const temp = await deleteDocsByKeyValue(
            "Key_List",
            "platform",
            item.platform
          );

          if (temp) {
            notifySuccess("l element a été bien supprimé");
            getMyPlatformList();
            console.log(
              "Après suppression, myPublicKeyList.value: ",
              myPublicKeyList.value
            );
          } else {
            notifyError("l element ne peut pas etre supprimé");
            getMyPlatformList();
          }
        })
        .onCancel(() => {
          // console.log('Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    };

    const getMyPlatformList = async () => {
      //myPublicKeyList.value = [];
      myPublicKeyList.value = await getCollectionData("Key_List");
    };
    onMounted(async () => {
      // check user connexion
      const temp = await checkIfUSerIsConnected();

      if (!temp) {
        router.push({ name: "login" });
      } else {
        platformListSupported.value = await getPlatformList();

        const platformListSupportedArrayForm = [];
        platformListSupported.value.data.data.forEach((element) => {
          platformListSupportedArrayForm.push(element);

          platformSupportedOption.value.push(element.label);
        });

        await checkCollectionfunction(
          // check if the user has already a local db for his data
          "Supported_Platforms_List",
          platformListSupportedArrayForm
        );
        await checkCollectionfunction(
          // check if the user has already a local db for his data
          "Key_List"
        );

        getMyPlatformList();
      }
    });

    const setKeyConnexion = async (item) => {
      const temp = await updateValue(
        "Key_List",
        { key: item.key },
        { connected: !item.connected }
      );

      console.log("Puis ça 2");

      // Appeler getMyPlatformList() après la mise à jour de la valeur
      await getMyPlatformList();
    };

    return {
      platformListSupported,
      myPublicKeyList,
      addNewKey,
      saveNewKey,
      dialogForNewKeyCreation,
      newPublicKey,
      platformSupportedOption,
      isPwd,
      hidekey,
      formatDate,
      hidekeyFunc,
      deletKeyFunc,
      setKeyConnexion,
    };
  },
});
</script>

<style>
.animated {
  animation: color-variation 1.5s infinite;
}

@keyframes color-variation {
  0% {
    background-color: rgb(211, 59, 59); /* Couleur initiale */
    background-position: left; /* Position initiale */
  }
  100% {
    background-color: rgb(255, 255, 255); /* Couleur finale */
    background-position: right; /* Position finale */
  }
}

.notanimated {
  background-color: rgb(0, 255, 13);
}

.zoomed {
  transform: scale(1.2); /* Ajustez la valeur de l'échelle selon vos besoins */
}
</style>
