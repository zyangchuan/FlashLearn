<template>
  <v-card class="py-7 px-3 px-sm-8 mx-auto" max-width="480px">
    <div class="mb-10">
      <slot name="headers">Header Slot</slot>
    </div>
    <v-form v-model="validated" ref="form">
      <div class="mx-4">
        <div class="my-10">
          <slot name="fields">Input Fields Slot</slot>
        </div>
        <div class="d-flex flex-column align-center">
          <slot name="buttons">Buttons Slot</slot>
        </div>
      </div>
    </v-form>
  </v-card>
</template>

<script>
import { ref } from '@vue/reactivity'

export default {
  setup() {
    const form = ref(null)
    const validated = ref(false)
    
    return { form, validated }
  }
}
</script>

<style>

</style>