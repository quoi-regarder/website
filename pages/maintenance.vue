<template>
  <div class="flex flex-col items-center gap-y-8 justify-center min-h-screen text-center">
    <NuxtImg src="/favicon.png" alt="Logo" width="160" height="160" loading="lazy" />
    <div class="flex items-center gap-x-4">
      <UIcon name="i-lucide:wrench" class="text-4xl text-primary-400" />
      <h1 class="text-4xl font-bold text-primary-400">
        {{ $t('maintenance.title') }}
      </h1>
    </div>
    <p class="text-lg max-w-lg">
      {{ $t('maintenance.message') }}
    </p>
  </div>
</template>
