<template>
  <div class="relative min-h-[92vh]">
    <NuxtImg
      alt="Background image"
      class="absolute object-cover w-full h-[92vh] opacity-30 bg-gradient-radial z-0"
      src="/img/background.webp"
    />

    <div class="relative z-10 flex flex-col items-center justify-center min-h-[92vh] p-4 gap-4">
      <div
        :class="{
          'h-fit': showCarousel
        }"
        class="w-full flex flex-col items-center gap-4 transition-all duration-500 ease-out relative z-10"
      >
        <h1 class="text-4xl text-center font-bold">
          {{ $t('search.title') }}
        </h1>
        <h2 class="text-center">
          {{ $t('search.description') }}
        </h2>

        <FilterType ref="typeFilterRef" class="mb-8" @update:model-value="selectedType = $event" />

        <div class="flex flex-col items-start justify-center mt-4 tablet:flex-row tablet:gap-4">
          <FieldInput
            v-model="search"
            :placeholder="$t('search.placeholder')"
            class="w-96 max-w-[90%] mx-auto"
            name="search"
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
      </div>

      <div
        id="carousel"
        :class="{ 'opacity-100': showCarousel, 'opacity-0': !showCarousel }"
        class="w-full flex items-center justify-center overflow-hidden transition-all duration-1000 ease-in relative z-10"
      >
        <UCarousel
          ref="carouselRef"
          :items="results"
          :ui="{ item: 'basis-full' }"
          arrows
          class="w-full"
        >
          <template #default="{ item }">
            <div
              class="mx-auto h-fit w-[98%] tablet:w-[90%] laptop:w-[80%] desktop:w-[60%] fullhd:w-[50%] flex flex-col items-start"
            >
              <MovieCard :genres="genres" :item="item" class="h-full" :type="selectedType" />
            </div>
          </template>
          <template #next="{ onClick, disabled }">
            <UButton
              :disabled="disabled"
              :ui="{ rounded: 'rounded-full' }"
              class="absolute right-2 top-[calc(3/2*100vw-2rem)] tablet:top-[calc((3/2*100vw-2rem)/2)] laptop:top-1/2"
              icon="i-heroicons-chevron-right"
              @click="onClick"
            />
          </template>
          <template #prev="{ onClick, disabled }">
            <UButton
              :disabled="disabled"
              :ui="{ rounded: 'rounded-full' }"
              class="absolute left-2 top-[calc(3/2*100vw-2rem)] tablet:top-[calc((3/2*100vw-2rem)/2)] laptop:top-1/2"
              icon="i-heroicons-chevron-left"
              @click="onClick"
            />
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
const carouselRef = ref()
const showCarousel = ref(false)

const search = ref<string>('')
const genres = ref([])

const results = ref([])
const page = ref(1)
const totalPages = ref(0)

onMounted(() => {
  fetchGenres()
})

const searchQuery = async (reset = false) => {
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

      useNotifications().success(t('common.toasts.title.success'), t('home.toasts.success.search'))

      window.scrollTo({ top: document.getElementById('carousel')?.offsetTop, behavior: 'smooth' })
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

  genres.value = data.genres
}

// Watchers
watch(
  () => carouselRef.value?.page,
  (currentPage) => {
    if (!carouselRef.value) return
    const isLastPage = currentPage === carouselRef.value.pages - 2
    if (isLastPage && page.value < totalPages.value) {
      page.value += 1
      searchQuery()
    }
  }
)
</script>

<style scoped>
.bg-gradient-radial {
  background: radial-gradient(circle, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 0.7) 100%);
  mask-image: radial-gradient(circle, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 1) 100%);
  -webkit-mask-image: radial-gradient(circle, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 1) 100%);
}
</style>
