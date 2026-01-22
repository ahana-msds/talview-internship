<template>
  <HelloWorld message="hello from typescript vue" />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import HelloWorld from "./components/HelloWorld.vue"

export default defineComponent({
  components: { HelloWorld }
})
</script>
