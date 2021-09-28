<template>
  <v-container class="pa-3" fluid>
    <v-snackbar
        v-model="alert.snackbar"
        :timeout="alert.snackbarTimeout"
    >
      {{ alert.snackbarText }}
    </v-snackbar>
    <div v-if="isLoading">Cargando Noticias...</div>
    <div v-else>
      <v-data-table
          :headers="headers"
          :items="stories"
          sort-by="id"
          :search="search"
          class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Noticias</v-toolbar-title>
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
          </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{ item }">

          <v-btn
              class="ma-2"
              text
              icon
              color="red lighten-2"
              @click="interact(item)"
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
import ItemDataService from "../services/ItemDataService";

export default {
  data: () => ({
    search: "",
    headers: [
      { text: "Titulo", value: "title", width: "60%" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    isLoading: true,
    stories: [],
    editedItem: {
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
    //
  },

  created() {
    this.loadStories();
  },

  methods: {

    async loadStories() {
      try {
        const tenNewStories = await this.get10NewStories();
        for (let i=0; i <tenNewStories.length;i++){
          const story = await this.getStory(tenNewStories[i]);
          this.stories.push(story);
        }
        this.isLoading = false;
        console.log(this.stories);
      } catch (error) {
        console.error(error);
      }
    },

    async getStory(id) {
      try {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        const response =  await fetch("https://hacker-news.firebaseio.com/v0/item/"+id+".json?print=pretty", requestOptions)
        const story =  await response.json();
        return story;
      } catch (error) {
        console.error(error);
      }
    },

    async get10NewStories() {
      try {
        const newStories = await this.getNewStories();
        const tenNewStories = newStories.slice(0,10);
        return tenNewStories;

      } catch (error) {
        console.error(error);
      }
    },

    async getNewStories() {
      try {
        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        const response = await fetch("https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty", requestOptions)
        const newStories = await response.json();
        return newStories;
      } catch (error) {
        console.error(error);
      }
    },

    async interact(item) {
      try {
        //this.editedIndex = this.stories.indexOf(item);
        this.editedItem = Object.assign({}, item);
        const loggedUser = JSON.parse(localStorage.getItem("user"));
        let interaction = {
          itemId: this.editedItem.id,
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

  },
};
</script>