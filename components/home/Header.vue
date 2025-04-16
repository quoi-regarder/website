<template>
  <UContainer
    class="w-full flex flex-col items-center justify-center gap-4 transition-all duration-500 ease-out relative"
  >
    <div class="flex flex-col items-center justify-center gap-y-4">
      <h1
        id="home"
        class="text-2xl md:text-4xl lg:text-5xl py-2 bg-gradient-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent font-bold text-center mb-2 animate-fade-in-down"
      >
        {{ $t('home.title') }}
      </h1>
      <h2
        class="text-lg md:text-xl lg:text-2xl font-semibold text-center mb-8 animate-fade-in-down"
      >
        {{ $t('home.subtitle') }}
      </h2>
    </div>

    <USeparator color="primary" icon="i-lucide:projector" class="animate-fade-in" />

    <div class="flex flex-col mt-4 animate-fade-in-up">
      <HomeFilterType v-model="selectedType" />
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const { selectedType } = useFilters()
</script>

<style scoped>
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}
</style>
