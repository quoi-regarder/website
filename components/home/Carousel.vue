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
      class="max-w-[75vw]"
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
const { nextPage, results, hasResults } = useSearch()
const carouselStore = useCarouselStore()

const carousel = useTemplateRef('carousel')
const currentIndex = ref<number>(carouselStore.currentIndex)
const isCarouselReady = ref<boolean>(false)

watch(
  () => carousel.value?.emblaApi,
  (api) => {
    if (api) {
      isCarouselReady.value = true

      api.on('select', () => {
        const index = api.selectedScrollSnap()
        if (index !== undefined) {
          currentIndex.value = index
          carouselStore.setCurrentIndex(index)
          if (index === results.value.length - 5) {
            nextPage()
          }
        }
      })

      setTimeout(() => {
        if (carouselStore.currentIndex > 0 && api && api.scrollTo) {
          api.scrollTo(carouselStore.currentIndex)
        }
      }, 100)
    }
  },
  { immediate: true }
)

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

onMounted(() => {
  if (currentIndex?.value && !carousel.value?.emblaApi) {
    carouselStore.setCurrentIndex(0)
  }
})

onUnmounted(() => {
  carouselStore.setCurrentIndex(currentIndex.value)
})
</script>
