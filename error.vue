<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
    <h1 class="text-4xl font-bold text-primary mb-4">
      {{ $t('error.title') }}
    </h1>
    <p class="text-lg text-gray-600 mb-6">
      {{ $t('error.message') }}
    </p>
    <UButton :label="$t('error.buttons.home')" size="xl" to="/" />
  </div>
</template>
