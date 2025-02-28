<template>
  <UContainer
    class="w-full flex flex-col items-center justify-center gap-4 transition-all duration-500 ease-out relative"
  >
    <div class="flex flex-col items-center justify-center gap-y-4">
      <h1 class="text-6xl text-primary-400 font-bold text-center mb-2">
        {{ $t('home.title') }}
      </h1>
      <h2 class="text-2xl font-semibold text-center mb-8">{{ $t('home.subtitle') }}</h2>
    </div>

    <USeparator color="primary" icon="i-lucide:projector" />

    <div class="flex flex-col mt-4">
      <HomeFilterType v-model="selectedType" />
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const { selectedType } = useFilters()
</script>
