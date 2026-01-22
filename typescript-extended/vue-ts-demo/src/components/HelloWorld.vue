<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  props: {
    message: {
      type: String,
      required: true
    }
  }
})
</script>

<template>
  <h2>{{ message }}</h2>
</template>
