<template>
  <section>
    <h3 class="text-l font-semibold text-secondary-400">
      {{ title }}
    </h3>
    <slot></slot>
  </section>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>
