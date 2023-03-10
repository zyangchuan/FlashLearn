<template>
  <v-app-bar app size="large">
    <v-app-bar-nav-icon
      color="white"
      v-on:click="drawer = !drawer"
    ></v-app-bar-nav-icon>
    <v-app-bar-title>
      <img
        :src="require('@/assets/flashlearn-text-logo.svg')"
        style="width: 100px"
        class="mt-1"
      />
    </v-app-bar-title>

    <p class="h6 mx-6 font-weight-medium hidden-sm-and-down">
      Hello {{ username }}
    </p>
    <!-- <v-btn 
      variant="flat" 
      prepend-icon="mdi-comment-quote-outline"
      class="text-capitalize">Feedback</v-btn> -->
    <v-btn
      color="white"
      prepend-icon="mdi-exit-to-app"
      :loading="signOutLoading"
      v-on:click="signOut"
      class="text-capitalize"
    >
      Sign out
    </v-btn>
  </v-app-bar>

  <v-navigation-drawer app temporary v-model="drawer" width="300">
    <div class="d-flex flex-column align-center my-10">
      <div class="avatar"></div>
      <p class="text-body-1 white mt-2">{{ username }}</p>
    </div>

    <v-list>
      <v-list-item
        prepend-icon="mdi-cards"
        title="Card decks"
        value="carddecks"
        v-bind:to="{ name: 'CardDecks' }"
        active-color="primary"
      >
      </v-list-item>

      <v-list-item prepend-icon="mdi-account-multiple" value="friends" disabled>
        <v-list-item-title class="d-inline">Friends</v-list-item-title>
        <v-chip class="mx-4" size="small">Coming soon</v-chip>
      </v-list-item>

      <v-list-item
        prepend-icon="mdi-account"
        title="Account"
        value="accounts"
        v-bind:to="{ name: 'Account' }"
        active-color="primary"
      >
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { ref } from "@vue/reactivity";
import { watchEffect } from "@vue/runtime-core";
import { useStore } from "vuex";
import { Auth, Hub } from "aws-amplify";

export default {
  setup() {
    const store = useStore();

    const drawer = ref(false);
    const username = ref("");

    watchEffect(() => {
      const user = store.state.currentUser;
      username.value = user.attributes.preferred_username;
    });

    const signOutLoading = ref(false);
    const signOut = () => {
      signOutLoading.value = true;
      Auth.signOut()
        .then(() => {
          store.commit("setCurrentUser", null);
          signOutLoading.value = false;
        })
        .catch((error) => {
          console.log(error);
          signOutLoading.value = false;
        });
    };

    return { drawer, username, signOutLoading, signOut };
  },
};
</script>
