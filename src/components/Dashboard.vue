<template>
  <v-container class="pa-3" fluid>
    <div v-if="isLoading">Cargando Dashboard...</div>
    <div v-else>
      <v-card class="mb-2" elevation="10" outlined shaped>
        <v-card-title> Bienvenido a ETIONIC: </v-card-title>
        <v-card-subtitle>DATOS DE USUARIO: </v-card-subtitle>
        <v-card-text>
          <p>Nombre: {{ user.name }}</p>
          <p>Email: {{ user.email }}</p>
        </v-card-text>
      </v-card>
      <tabla-items></tabla-items>
    </div>
  </v-container>
</template>

<script>
import UserDataService from "../services/UserDataService";
import TablaItems from "./TablaItems";

export default {
  components: {TablaItems},
  data: () => ({
    isLoading: true,
    user: {
      name: "",
      email: ""
    },
  }),

  created() {
    const user_id = JSON.parse(localStorage.getItem("user")).user.id;
    this.getUsuario(user_id);
  },

  methods: {
    async getUsuario(user_id) {
      try {
        const response = await UserDataService.show(user_id);
        this.user.name = response.data.data.name;
        this.user.email = response.data.data.email;
        this.isLoading = false;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>