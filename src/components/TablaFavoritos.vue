<template>
  <v-container class="pa-3" fluid>
    <v-snackbar
        v-model="alert.snackbar"
        :timeout="alert.snackbarTimeout"
    >
      {{ alert.snackbarText }}
    </v-snackbar>
    <div v-if="isLoading">Cargando Favoritos...</div>
    <div v-else>
      <v-data-table
          :headers="headers"
          :items="favorites"
          sort-by="id"
          :search="search"
          class="elevation-1"
      >
        <template #item.url="{ item }">
          <a target="_blank" :href="item.url">
            {{ item.url }}
          </a>
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Favoritos</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
                class="mr-2"
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
            >
            </v-text-field>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline"
                >Esta seguro que desea eliminar esta noticia de sus favoritos?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancelar</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{ item }">

          <v-btn
              class="ma-2"
              text
              icon
              color="red lighten-2"
              @click="deleteItem(item)"
          >
            <v-icon>mdi-heart</v-icon>
          </v-btn>

        </template>


        <template v-slot:no-data>
          <br />
          <v-alert dense outlined text type="info" color="primary">
            Sin Registros
          </v-alert>
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>

<script>
import UserDataService from "../services/UserDataService";
import ItemDataService from "../services/ItemDataService";

export default {
  data: () => ({
    search: "",
    headers: [
      { text: "Titulo", value: "title", width: "45%" },
      { text: "Link", value: "url", width: "55%" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    isLoading: true,
    favorites: [],
    editedIndex: -1,
    dialogDelete: false,
    editedItem: {
      itemId: null,
      userId: null,
      itemTitle: "",
      itemUrl: ""
    },
    defaultItem: {
      itemId: null,
      userId: null,
      itemTitle: "",
      itemUrl: ""
    },
    alert: {
      snackbar: false,
      snackbarText: '',
      snackbarTimeout: 3000,
    }
  }),

  computed: {
    //
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.loadFavorites();
  },

  methods: {

    async loadFavorites() {
      try {
        const loggedUser = JSON.parse(localStorage.getItem("user"));
        const userId= loggedUser.user.id;

        const favoritos = await UserDataService.show(userId);
        console.log(favoritos);
        for (let i=0; i < favoritos.data.data.items.length;i++){
          this.favorites.push(favoritos.data.data.items[i]);
        }

        this.isLoading = false;
      } catch (error) {
        console.error(error);
      }
    },

    async interact(item) {
      try {
        this.editedItem = Object.assign({}, item);
        const loggedUser = JSON.parse(localStorage.getItem("user"));
        let interaction = {
          itemId: this.editedItem.itemId,
          itemTitle: this.editedItem.title,
          itemUrl: this.editedItem.url,
          userId: loggedUser.user.id,
        };
        const response = await ItemDataService.store(interaction);

        this.alert.snackbarText = response.data.toggle;
        this.alert.snackbar = true;
      } catch (err) {
        // Handle Error Here
        console.error(err);
      }
    },

    deleteItem(item) {
      this.editedIndex = this.favorites.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.interact(this.editedItem);
      this.favorites.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

  },
};
</script>