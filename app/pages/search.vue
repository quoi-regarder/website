<template>
  <div class="relative min-h-[92vh]">
    <div
      class="bg-white/85 dark:bg-black/82 min-h-[94vh] w-full bg-[url('/background.webp')] bg-blend-overlay bg-cover bg-center bg-no-repeat absolute z-0"
    />

    <div class="relative z-10 flex flex-col items-center justify-center min-h-[94vh] gap-4">
      <UContainer
        class="w-full flex flex-col items-center gap-4 transition-all duration-500 ease-out relative z-10"
      >
        <h1
          class="text-2xl md:text-4xl lg:text-5xl py-2 bg-gradient-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent text-center font-bold"
        >
          {{ t('search.title') }}
        </h1>
        <h2 class="text-lg md:text-xl lg:text-2xl text-center font-semibold">
          {{ t('search.description') }}
        </h2>

        <USeparator color="primary" icon="i-lucide:projector" />

        <HomeFilterType v-model="selectedType" />

        <div class="flex flex-col items-center justify-center mt-4 lg:flex-row gap-4">
          <FieldInput
            v-model="search"
            :placeholder="t('search.placeholder')"
            class="w-96 max-w-[90%] mx-auto"
            name="search"
            min-height="min-h-8"
          />

          <UButton
            :loading="searching"
            icon="i-lucide:search-check"
            size="xl"
            class="mx-auto"
            :label="t('search.buttons.search')"
            @click="searchQuery(true)"
          />

          <UButton
            icon="i-lucide:undo-2"
            color="secondary"
            size="xl"
            variant="subtle"
            :label="t('search.buttons.reset')"
            @click="resetSearchAndFilters"
          />
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
          class="w-[90vw]"
          arrows
          wheel-gestures
          :prev="{ color: 'secondary', variant: 'solid' }"
          :next="{ color: 'secondary', variant: 'solid' }"
          :ui="{
            item: 'basis-full 2xl:basis-[65%] lg:transition-opacity lg:[&:not(.is-snapped)]:opacity-30'
          }"
        >
          <template #default="{ item }">
            <MovieCard
              :genres="selectedType === 'movie' ? movies_genres : tv_genres"
              :item="item"
              class="h-full"
              :type="selectedType"
            />
          </template>
        </UCarousel>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t, locale } = useI18n()
const route = useRouter()

useSeoMeta({
  title: t('seo.pages.search'),
  description: t('seo.descriptions.search'),
  ogTitle: t('seo.pages.search'),
  ogDescription: t('seo.descriptions.search'),
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

useSchemaOrg([
  defineWebPage({
    name: t('seo.pages.search'),
    description: t('seo.descriptions.search'),
    inLanguage: locale.value
  })
])

const selectedType = ref<'movie' | 'tv'>('movie')

// Carousel
const searching = ref(false)
const showCarousel = ref(false)

const search = ref<string>('')
const carousel = useTemplateRef('carousel')
const { genres: movies_genres } = useTmdbGenres('movie')
const { genres: tv_genres } = useTmdbGenres('tv')

const results = ref<any[]>([])
const page = ref(1)
const totalPages = ref(0)

defineShortcuts({
  escape: {
    handler: () => resetSearchAndFilters(),
    usingInput: true
  },
  enter: {
    handler: () => searchQuery(true),
    usingInput: true
  }
})

onMounted(() => {
  if (route.currentRoute.value.query.query) {
    search.value = route.currentRoute.value.query.query as string
    selectedType.value = route.currentRoute.value.query.type as 'movie' | 'tv'
    searchQuery(true)
  }
})

const resetSearch = () => {
  page.value = 1
  results.value = []
  totalPages.value = 0
}

const resetSearchAndFilters = () => {
  resetSearch()
  search.value = ''
}

const searchQuery = async (reset = false, showToast = true) => {
  if (reset) {
    resetSearch()
  }

  if (page.value > totalPages.value && totalPages.value !== 0) return

  try {
    searching.value = true
    const manager = new QueryParamsManager(`/api/themoviedb/search/${selectedType.value}`)
    manager.add('query', search.value || '')
    manager.add('page', page.value)
    manager.add('language', locale.value)

    const data: any = await $fetch(manager.toString())

    page.value = data.page
    totalPages.value = data.total_pages
    results.value = [...results.value, ...data.results]
  } catch (error) {
    console.error('Error searching.')
  } finally {
    searching.value = false

    if (results.value.length > 0) {
      showCarousel.value = true

      if (showToast) {
        useNotifications().success(
          t('common.toasts.title.success'),
          t('home.toasts.success.search')
        )

        const carousel = document.getElementById('carousel')
        if (carousel) {
          const isMobile = window.innerWidth <= 768

          window.scrollTo({
            top: isMobile ? carousel.offsetTop - 70 : carousel.offsetTop - 250,
            behavior: 'smooth'
          })
        }
      }
    } else {
      showCarousel.value = false
      useNotifications().info(t('common.toasts.title.info'), t('home.toasts.error.search'))
    }
  }
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

watch(route.currentRoute, () => {
  if (route.currentRoute.value.query.query) {
    search.value = route.currentRoute.value.query.query as string
    selectedType.value = route.currentRoute.value.query.type as 'movie' | 'tv'
    searchQuery(true)
  } else {
    resetSearchAndFilters()
  }
})

watch(selectedType, () => {
  resetSearch()
})
</script>
