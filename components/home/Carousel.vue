<template>
  <div
    id="carousel"
    :class="{ 'opacity-100 py-8': hasResults, 'opacity-0': !hasResults }"
    class="w-full flex items-center justify-center overflow-hidden transition-all duration-500 ease-in relative"
  >
    <UCarousel
      v-if="hasResults"
      ref="carousel"
      :prev="{
        color: 'secondary',
        variant: 'solid',
        class: 'hover:scale-110 transition-transform duration-300'
      }"
      :next="{
        color: 'secondary',
        variant: 'solid',
        class: 'hover:scale-110 transition-transform duration-300'
      }"
      :items="results"
      class-names
      class="max-w-[75vw] animate-slide-in-right"
      arrows
      wheel-gestures
      :ui="{
        item: 'basis-full 2xl:basis-[65%] lg:transition-all lg:duration-500 lg:[&:not(.is-snapped)]:opacity-30 lg:[&:not(.is-snapped)]:scale-95 lg:is-snapped:scale-100'
      }"
    >
      <template #default="{ item }">
        <MovieCard :genres="genres" :item="item" class="h-full my-4" :type="selectedType" />
      </template>
    </UCarousel>
  </div>
</template>

<script lang="ts" setup>
const genres = defineModel<Option[]>('genres', {
  required: true,
  default: () => []
})

const { selectedType } = useFilters()
const { nextPage, results, hasResults, resetSearch } = useSearch()

const carousel = useTemplateRef('carousel')

watch(carousel, () => {
  if (carousel.value?.emblaApi) {
    carousel.value.emblaApi.on('select', () => {
      const index = carousel.value?.emblaApi?.selectedScrollSnap()
      if (index === results.value.length - 5) {
        nextPage()
      }
    })
  }
})

watch(hasResults, (newValue) => {
  if (newValue) {
    nextTick(() => {
      const carouselElement = document.getElementById('carousel')
      if (carouselElement) {
        const isMobile = window.innerWidth <= 768
        const offset = isMobile ? 70 : 250
        window.scrollTo({
          top: carouselElement.offsetTop - offset,
          behavior: 'smooth'
        })
      }
    })
  }
})

onUnmounted(() => {
  resetSearch()
})
</script>

<style scoped>
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-right {
  animation: slideInRight 0.8s ease-out forwards;
}
</style>
