<template>
  <section>
    <h3 class="text-l font-semibold text-primary">
      {{ title }}
    </h3>
    <slot></slot>
  </section>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>
