<template>
  <div class="relative min-h-[92vh]">
    <NuxtImg
      alt="Background image"
      class="absolute object-cover w-full h-[92vh] opacity-30 bg-gradient-radial z-0"
      src="/img/background.webp"
      format="webp"
      preload
    />

    <div class="relative z-10 flex flex-col items-center justify-center min-h-[92vh] gap-4">
      <UContainer
        :class="{
          'h-fit': showCarousel
        }"
        class="w-full flex flex-col items-center gap-4 transition-all duration-500 ease-out relative z-10"
      >
        <h1 class="text-4xl text-[var(--ui-color-primary-400)] text-center font-bold mb-2">
          {{ $t('search.title') }}
        </h1>
        <h2 class="text-center">
          {{ $t('search.description') }}
        </h2>

        <FilterType v-model="selectedType" />

        <div class="flex flex-col items-start justify-center mt-4 sm:flex-row sm:gap-4">
          <FieldInput
            v-model="search"
            :placeholder="$t('search.placeholder')"
            class="w-96 max-w-[90%] mx-auto"
            name="search"
            min-height="min-h-8"
          />

          <UButton
            :loading="searching"
            icon="i-heroicons-magnifying-glass"
            size="xl"
            class="mx-auto"
            @click="searchQuery(true)"
          >
            {{ $t('search.buttons.search') }}
          </UButton>
        </div>
      </UContainer>

      <div
        id="carousel"
        :class="{ 'opacity-100': showCarousel, 'opacity-0': !showCarousel }"
        class="w-full flex items-center justify-center overflow-hidden transition-all duration-1000 ease-in relative z-10"
      >
        <UCarousel
          ref="carousel"
          :items="results"
          class-names
          class="max-w-[75vw]"
          arrows
          :ui="{
            item: 'basis-full 2xl:basis-[65%] lg:transition-opacity lg:[&:not(.is-snapped)]:opacity-30'
          }"
        >
          <template #default="{ item }">
            <MovieCard :genres="genres" :item="item" class="h-full" :type="selectedType" />
          </template>
        </UCarousel>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t, locale } = useI18n()

useHead({
  title: t('seo.pages.search'),
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: t('seo.descriptions.search')
    }
  ]
})

const selectedType = ref<'movie' | 'tv'>('movie')

// Carousel
const searching = ref(false)
const showCarousel = ref(false)

const search = ref<string>('')
const carousel = useTemplateRef('carousel')
const genres = ref([])

const results = ref([])
const page = ref(1)
const totalPages = ref(0)

onMounted(() => {
  fetchGenres()
})

const searchQuery = async (reset = false, showToast = true) => {
  if (reset) {
    page.value = 1
    results.value = []
    totalPages.value = 0
  }

  if (page.value > totalPages.value && totalPages.value !== 0) return

  try {
    searching.value = true
    const manager = new QueryParamsManager(`/api/themoviedb/search/${selectedType.value}`)
    manager.add('query', search.value || '')
    manager.add('page', page.value)
    manager.add('language', locale.value)

    const data = await $fetch(manager.toString())

    page.value = data.page
    totalPages.value = data.total_pages
    results.value = [...results.value, ...data.results]
  } catch (error) {
    console.error('Error searching:', error)
  } finally {
    searching.value = false

    if (results.value.length > 0) {
      showCarousel.value = true

      if (showToast) {
        useNotifications().success(
          t('common.toasts.title.success'),
          t('home.toasts.success.search')
        )
        window.scrollTo({ top: document.getElementById('carousel')?.offsetTop, behavior: 'smooth' })
      }
    } else {
      showCarousel.value = false
      useNotifications().info(t('common.toasts.title.info'), t('home.toasts.error.search'))
    }
  }
}

const fetchGenres = async () => {
  const manager = new QueryParamsManager(`/api/themoviedb/genre/${selectedType.value}/list`)
  manager.add('language', locale.value)
  const data = await $fetch(manager.toString())

  genres.value = data.genres.map((genre: any) => ({
    id: genre.id,
    label: genre.name
  }))
}

watch(carousel, () => {
  if (carousel.value?.emblaApi) {
    carousel.value.emblaApi.on('select', () => {
      const index = carousel.value?.emblaApi?.selectedScrollSnap()
      if (index === results.value.length - 5) {
        page.value++
        searchQuery(false, false)
      }
    })
  }
})
</script>

<style scoped>
.bg-gradient-radial {
  background: radial-gradient(circle, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 0.7) 100%);
  mask-image: radial-gradient(circle, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 1) 100%);
  -webkit-mask-image: radial-gradient(circle, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 1) 100%);
}
</style>
