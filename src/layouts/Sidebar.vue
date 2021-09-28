<template>
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense v-if="isLogged">
        <v-list-item link to="/dashboard">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click.native="logout">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Salir</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("login", {
      isLogged: "isLogged",
    }),
  },
  data: () => ({ drawer: false }),
  methods: {
    logout() {
      this.$store.dispatch("login/logout");
    },
  },
};
</script>