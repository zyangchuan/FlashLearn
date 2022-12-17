<template>
  <v-app-bar app size="large">
    <v-app-bar-nav-icon color="white" v-on:click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title>
        <span class="font-weight-light">The Revision App</span>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn 
        color="white"
        prepend-icon="mdi-exit-to-app"
        v-on:click="redirect">
        Sign out
    </v-btn>
  </v-app-bar>

  <v-navigation-drawer app temporary v-model="drawer">
    <div class="d-flex flex-column align-center my-10">
        <v-avatar size="100" class="mb-2">
            <v-img src="/avatar.jpg"></v-img>
        </v-avatar>
        <p class="text-body-1 white">Zhang Yangchuan</p>
    </div>

    <v-list>
        <v-list-item 
            v-for="option in drawerOptions" 
            v-bind:key="option.value"
            v-bind:value="option.value">
            
            <template v-slot:prepend>
                <v-icon :icon="option.icon"></v-icon>
            </template>
            <v-list-item-title v-text="option.title"></v-list-item-title>

        </v-list-item>
    </v-list>

  </v-navigation-drawer>

</template>

<script>
export default {
    data () {
        return {
            drawer: false,
            drawerOptions: [
                {title: "Card decks", icon: "mdi-cards", value: 1},
                {title: "Account", icon: "mdi-account", value: 2},
                {title: "Settings", icon: "mdi-cog", value: 3}
            ]
        }
    },
    methods: {
        redirect () {
            this.$router.push({ name: 'Login' })
        }
    }
}
</script>

<style>

</style>