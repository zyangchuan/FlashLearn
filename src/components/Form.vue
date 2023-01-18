<template>
  <div style="max-width: 480px; margin: auto;">
    <v-card class="py-7 px-5 px-sm-12">
      <div class="mb-10">
        <slot name="headers">Header Slot</slot>
      </div>
      <v-form v-model="validated" ref="form">
        <div>
          <div class="my-10">
            <slot name="fields">Input Fields Slot</slot>
          </div>
          <slot name="buttons">Buttons Slot</slot>
        </div>
      </v-form>
    </v-card>
  </div>
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