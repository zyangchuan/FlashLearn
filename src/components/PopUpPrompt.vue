<template>
  <v-overlay v-model="show" scrim="black" class="justify-center align-center">
    <v-card class="popup pa-4 mx-auto">
      <div class="d-flex flex-column">
        <p class="text-h6 font-weight-light text-center my-2">
          <slot name="message">
            Default message
          </slot>
        </p>
        <div class="d-flex justify-center my-2">
          <slot name="actions">
            Default actions
          </slot>
        </div>
      </div>
    </v-card>
  </v-overlay>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  }
}
</script>

<style>
  .popup {
    min-width: 100px;
    max-width: 450px;
    min-height: 120px;
  }
</style>