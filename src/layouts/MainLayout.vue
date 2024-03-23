<template>



  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
        v-if="!$q.screen.gt.sm"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="drawer = !drawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
    v-model="drawer"
        show-if-above

        :mini="miniState"
        @mouseover="miniState = false"
        @mouseout="miniState = true"
        mini-to-overlay

        :width="300"
        :breakpoint="500"
        bordered
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-list>


        <EssentialLink
        clickable
          v-for="(link) in essentialSections"
          :key="link.title"
          v-bind="link"
          :active="link.to.name === selectedSection"

          @click="updateSelectedSection(link.to.name)"

        />
        <q-separator></q-separator>


        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          :href="link.to"


        />
        <q-separator></q-separator>
        <q-item
          clickable
          tag="a"
          target=""
          href="login"
          @click="logout()"
        >
          <q-item-section
            avatar
          >
            <q-icon name="logout" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Lougout</q-item-label>
            <q-item-label caption>Logout from you account</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>





</template>

<script>
import { defineComponent, ref , onMounted} from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import useNotify from "src/composables/UseNotify";
import { useRouter } from "vue-router";
import axios from 'axios';


export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {



    const selectedSection = ref()

    let essentialSections = [
    {
    title: 'Home',
    caption: 'Home',
    icon: 'mdi-home',
    to: { name: 'welcome' },
    target:'',

  },

  {
    title: 'Profil',
    caption: 'Your profil',
    icon: 'mdi-account',
    to: { name: 'userprofil' },
    target:'',

  },{
    title: 'Portfolio',
    caption: 'Your portfolio',
    icon: 'mdi-wallet',
     to: { name: 'userportfolio' },
    target:'',

  },]

let essentialLinks = [

  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
    target:'_blank'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
    target:'_blank'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
    target:'_blank'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
    target:'_blank'
  }
]

    const { notifyError, notifySuccess } = useNotify();


    const drawer = ref(false)
    const miniState = ref(true)

    const router = useRouter();
    const url = `http://localhost:${ process.env.GATEWAY_PORT}`
    const isLoggedIn = ref(false)


    // Fonction pour définir un cookie

function deleteCookie(name) {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}


    const logout = async () => {
      deleteCookie('my-access-token');
      deleteCookie('my-refresh-token');
      await axios.get(`${url}/logout`)

    }

    const updateSelectedSection = (item) => {
      selectedSection.value = item
    }

    onMounted(async () => {
      selectedSection.value =  router.currentRoute.value.name;

      isLoggedIn.value = await axios.get(`${url}/isloggedin`)
      console.log(isLoggedIn.value)
      if (!isLoggedIn.value) {
        router.push({ name: "login" });
      }
    });



    return {
      essentialLinks,
      essentialSections ,

      drawer,
      logout,
      selectedSection,
      updateSelectedSection,


      miniState

    }
  }
})
</script>
