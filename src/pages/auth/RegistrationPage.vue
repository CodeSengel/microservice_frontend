<template>
  <q-page padding>



  <div class="registration-page-container row flex flex-center">
    <div class="registration-form  col-xs-8 col-sm-6">
      <h5 class="registration-title">Create an Account</h5>
      <q-form @submit.prevent="handleRegister()" class="q-gutter-xs">
        <q-input
          outlined
          v-model="form.name"
          label="Name"
          dense
          clearable
          lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Name is required',
                ]"
        />
        <q-input
          outlined
          v-model="form.email"
          label="Email"
          type="email"
          dense
          clearable
          lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Email is required',
                ]"
        />
        <q-input
          outlined
          v-model="form.password"
          label="Password"
          type="password"
          dense
          clearable
          lazy-rules
                :rules="[
                  (val) => (val && val.length >= 6) || 'Minimum 6 characters ',
                ]"
        />
        <q-input
          outlined
          v-model="form.password2"
          label="Confirm Password"
          type="password"
          dense
          clearable
          lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Condirm the password ',
                ]"

        />
        <q-card-actions class="q-px-md full-wdth  flex flex-center">
                <q-btn
                  unelevated
                  dense
                  color="purple-5"
                  size="lg"
                  class=""
                  type="submit"
                  label="register"
                  glossy

                />
              </q-card-actions>
      </q-form>
      <p class="text-center q-mt-lg">Already have an account? <router-link to="/login">Login</router-link></p>
    </div>
  </div>
</q-page>
</template>


<script>
import { defineComponent, ref } from "vue";
import axios from 'axios';
import { useQuasar } from "quasar";

//import useAuthUser from "src/composables/UseAuthUser";
import UseNotify from "src/composables/UseNotify";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "RegistrationPage",
  setup() {
    //const router = useRouter();
    //const { register } = useAuthUser();

    const { notifySuccess, notifyError } = UseNotify();
    const router = useRouter();

    const form = ref({
      name: "",
      email: "",
      password: "",
      password2: "",
    });

    const handleRegister = async () => {


      if (form.value.password == form.value.password2) {
        try {
          //await register(form.value);
          const response = await axios.post(`http://localhost:${ process.env.GATEWAY_PORT}/register`,form.value); // Remplacez l'URL par celle de votre route dans la gateway

          console.log(response)

          router.push({
            name: "emailverification",
            query: { email: form.value.email },
          });
        } catch (error) {
          notifyError(error.message);
        }

      } else {
        notifyError("The two passwords have to be equal");
      }

    };

    return {
      form,
      handleRegister,
    };
  },


});
</script>

