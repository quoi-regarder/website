<template>
  <div
    id="carousel"
    :class="{ 'opacity-100': hasResults, 'opacity-0': !hasResults }"
    class="w-full flex items-center justify-center overflow-hidden transition-all duration-500 ease-in relative"
  >
    <UCarousel
      v-if="hasResults"
      ref="carousel"
      :items="results"
      class-names
      class="max-w-[75vw]"
      arrows
      wheel-gestures
      :ui="{
        item: 'basis-full 2xl:basis-[65%] lg:transition-opacity lg:[&:not(.is-snapped)]:opacity-30'
      }"
    >
      <template #default="{ item }">
        <MovieCard :genres="genres" :item="item" class="h-full" :type="selectedType" />
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
const { nextPage, results, hasResults } = useSearch()

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
</script>
