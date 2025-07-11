<template>
  <div
    class="flex flex-col items-center gap-y-8 justify-center min-h-screen text-center p-4 bg-[var(--ui-bg)] dark:bg-[var(--ui-bg-muted)]"
  >
    <!-- Logo avec animation au hover -->
    <NuxtImg
      src="/favicon.png"
      alt="Logo"
      width="160"
      height="160"
      class="cursor-pointer transform transition-transform hover:scale-110"
      loading="lazy"
      @click="navigateTo(localePath('/'))"
    />

    <!-- Error Status -->
    <div v-if="error" class="flex flex-col gap-y-4">
      <h1 class="text-6xl font-bold text-primary-400">
        {{ error.statusCode }}
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        {{ error.statusMessage || $t('error.title') }}
      </p>
    </div>

    <p class="text-lg max-w-md">
      {{ $t('error.message') }}
    </p>

    <!-- Actions -->
    <div class="flex flex-wrap gap-4 justify-center">
      <UButton
        :label="$t('error.buttons.home')"
        :to="localePath('/')"
        size="xl"
        variant="solid"
        color="primary"
        icon="i-lucide:house"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const localePath = useLocalePath()

defineProps<{
  error?: {
    statusCode: number
    statusMessage?: string
    data?: any
  }
}>()
</script>
