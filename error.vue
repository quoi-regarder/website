<template>
  <div class="flex flex-col items-center gap-y-8 justify-center min-h-screen text-center">
    <NuxtImg
      src="/favicon.png"
      alt="Logo"
      width="160"
      height="160"
      class="cursor-pointer"
      @click="navigateTo(localePath('/'))"
    />
    <h1 class="text-4xl font-bold text-[var(--ui-color-primary-400)]">
      {{ $t('error.title') }}
    </h1>
    <p class="text-lg">
      {{ $t('error.message') }}
    </p>
    <UButton :label="$t('error.buttons.home')" :to="localePath('/')" size="xl" />
  </div>
</template>

<script lang="ts" setup>
const localePath = useLocalePath()
</script>
