<template>
  <div class="bg-gray-200 animate-pulse dark:bg-gray-800 rounded-md" :class="classes"></div>
</template>

<script lang="ts" setup>
const props = defineProps({
  classes: {
    type: String,
    default: ''
  }
})

const classes = computed(() => `${props.classes}`)
</script>
