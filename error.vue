<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center dark:bg-gray-700"
  >
    <h1 class="text-4xl font-bold text-primary mb-4">
      {{ $t('error.title') }}
    </h1>
    <p class="text-lg text-gray-600 mb-6 dark:text-gray-200">
      {{ $t('error.message') }}
    </p>
    <UButton :label="$t('error.buttons.home')" size="xl" :to="localePath('/')" />
  </div>
</template>

<script lang="ts" setup>
const localePath = useLocalePath()
</script>
