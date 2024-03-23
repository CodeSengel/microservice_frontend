<template>
  <q-page class="flex flex-center">
    <div>
      <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    >
    </div>

    <div>
      {{ data.message }}
    </div>

  </q-page>
</template>

<script>
import { defineComponent , onMounted, ref} from 'vue'
import axios from 'axios';


export default defineComponent({
  name: 'IndexPage',



  setup(){



    const data = ref([])

    const fetchData = async () => {
      console.log('la je vais récupérer la donnée')

      try {
        const response = await axios.get('http://localhost:3006/test'); // Remplacez l'URL par celle de votre route dans la gateway
        data.value = response.data; // Stocker les données récupérées dans testData
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    }


    onMounted(()=> {
      console.log('Port du frontend :', process.env.FRONTEND_PORT);
      fetchData()
    })
    return{data}
  }
})
</script>
