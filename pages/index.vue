<template>
  <div class="flex flex-col">
    <!-- Header -->
    <div
      :class="{
        'h-[30vh] laptop:h-[15vh]': showCarousel,
        'h-[30vh] tablet:h-[52vh]': !showCarousel
      }"
      class="w-full overflow-hidden transition-[height] duration-500 ease-out"
    >
      <div class="h-full w-full flex items-center justify-center">
        <div
          class="flex flex-col tablet-md:flex-row tablet-md:w-2/3 laptop:w-1/2 desktop:w-1/3 tablet:gap-x-4"
        >
          <field-input
            v-model="search"
            :display-hint="false"
            :label="$t('home.form.fields.search')"
            class="w-full"
            icon="search"
            name="search"
          />
          <UButton
            :loading="searching"
            class="h-fit tablet:mt-7"
            icon="i-heroicons-magnifying-glass"
            size="xl"
            @click="searchQuery(true)"
          >
            {{ $t('home.form.buttons.search') }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Carousel Section -->
    <div
      :class="{ 'opacity-100 min-h-[78vh]': showCarousel, 'opacity-0': !showCarousel }"
      class="w-full flex items-center justify-center overflow-hidden transition-all duration-500 ease-in"
    >
      <UCarousel
        ref="carouselRef"
        :items="movies"
        :ui="{ item: 'basis-full' }"
        arrows
        class="w-full"
      >
        <template #default="{ item }">
          <div
            class="mx-auto h-fit w-[98%] tablet:w-[90%] laptop:w-[85%] desktop:w-[65%] fullhd:w-[55%] flex flex-col items-start"
          >
            <MovieCard :genres="genres" :movie="item" class="h-full" />
          </div>
        </template>
        <template #next="{ onClick, disabled }">
          <UButton
            :disabled="disabled"
            :ui="{ rounded: 'rounded-full' }"
            class="absolute right-2 top-[calc(3/2*100vw-1rem)] tablet:top-[calc((3/2*100vw-1rem)/2)] laptop:top-1/2"
            icon="i-heroicons-chevron-right"
            variant="soft"
            @click="onClick"
          />
        </template>
        <template #prev="{ onClick, disabled }">
          <UButton
            :disabled="disabled"
            :ui="{ rounded: 'rounded-full' }"
            class="absolute left-2 top-[calc(3/2*100vw-1rem)] tablet:top-[calc((3/2*100vw-1rem)/2)] laptop:top-1/2"
            icon="i-heroicons-chevron-left"
            variant="soft"
            @click="onClick"
          />
        </template>
      </UCarousel>
    </div>

    <!-- Bottom Section -->
    <div
      :class="{
        'min-h-[0vh] opacity-100': showCarousel,
        'min-h-[40vh] opacity-100': !showCarousel
      }"
      class="w-full flex flex-col overflow-hidden transition-all duration-500 ease-out"
    >
      <div class="flex w-full p-4 gap-4">
        <div class="flex flex-col gap-4 items-center justify-center w-3/5">
          <HomeGenre
            @update:genres="genres = $event"
            @update:selected-genres="selectedGenres = $event"
          />
        </div>
        <div class="border-r-2 border-gray-200 dark:border-gray-500" />
        <div class="flex flex-col gap-4 items-center justify-center w-2/5">
          <HomePlatforms
            @update:selected-platforms="selectedPlatforms = $event"
            @update:platforms="platforms = $event"
          />
          <HomeMark @update:selected-mark="selectedMark = $event" />
        </div>
      </div>
      <UButton block class="mt-4" size="xl" variant="link" @click="toggleMoreFilters">
        <div class="flex flex-col items-center justify-center gap-2">
          <span>{{ $t('home.form.buttons.moreFilters') }}</span>
          <UIcon
            :class="{ 'rotate-180': moreFilters }"
            class="text-primary size-6 transition-all duration-300"
            name="i-heroicons-chevron-down"
          />
        </div>
      </UButton>
    </div>

    <!-- More Filters Section -->
    <div
      v-if="moreFilters || moreFiltersTransition"
      :class="{
        'min-h-fit opacity-100 visible': moreFilters,
        'min-h-0 opacity-0 invisible': !moreFilters
      }"
      class="flex w-full gap-4 p-4 overflow-hidden transition-all duration-1000 ease-in-out"
      @transitionend="handleTransitionEnd"
    >
      <div class="flex flex-col gap-4 items-center justify-center w-3/5">
        <HomeType @update:selected-types="selectedTypes = $event" />
        <HomeAge @update:selected-ages="selectedAges = $event" />
        <HomeFilter @update:selected-filter="selectedFilter = $event" />
      </div>
      <div class="border-r-2 border-gray-200 dark:border-gray-500" />
      <div class="flex flex-col gap-4 items-center justify-center w-2/5">
        <HomeYear @update:selected-years="selectedYears = $event" />
        <HomeDirector @update:selected-directors="selectedDirectors = $event" />
        <HomeActor @update:selected-actors="selectedActors = $event" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { locale, t } = useI18n()

useHead({
  title: t('seo.title'),
  meta: [{ hid: 'description', name: 'description', content: t('seo.description') }]
})

// Filters state
const selectedGenres = ref([])
const selectedPlatforms = ref([])
const selectedTypes = ref([])
const selectedAges = ref([])
const selectedFilter = ref([])
const selectedMark = ref(1)
const selectedYears = ref([])
const selectedDirectors = ref([])
const selectedActors = ref([])

// Data
const search = ref('')
const genres = ref([])
const platforms = ref([])
const moreFilters = ref(false)

// Carousel
const searching = ref(false)
const carouselRef = ref()
const showCarousel = ref(false)

// Transition
const moreFiltersTransition = ref(false)

// Movies
const movies = ref([])

// Pagination
const page = ref(1)
const totalPages = ref(0)

// Méthodes
const searchQuery = async (reset = false, showToast = true) => {
  if (reset) {
    resetSearchState()
  }

  if (page.value > totalPages.value && totalPages.value !== 0) return
  searching.value = true

  try {
    const manager = new QueryParamsManager('/api/themoviedb/discover/movie')
    handleQueryFilters(manager)

    const data = await $fetch(manager.toString())

    page.value = data.page
    totalPages.value = data.total_pages
    movies.value = [...movies.value, ...data.results]
  } catch (error) {
    console.error('Error fetching movies:', error)
  } finally {
    searching.value = false
    showCarousel.value = true

    if (showToast) {
      useNotifications().success(t('common.toasts.title.success'), t('home.toasts.success.search'))
    }
  }
}

const resetSearchState = () => {
  movies.value = []
  page.value = 1
  totalPages.value = 0
  if (carouselRef.value) {
    carouselRef.value.page = 0
  }
}

const handleQueryFilters = (manager: QueryParamsManager) => {
  manager.add('language', locale.value)
  manager.add('page', page.value)

  return manager
}

watch(
  () => carouselRef.value?.page,
  (currentPage) => {
    if (!carouselRef.value) return
    const isLastPage = currentPage === carouselRef.value.pages - 2
    if (isLastPage && page.value < totalPages.value) {
      page.value += 1
      searchQuery(false, false)
    }
  }
)

const toggleMoreFilters = () => {
  moreFilters.value = !moreFilters.value
  moreFiltersTransition.value = true
  setTimeout(() => {
    const scrollTarget = moreFilters.value ? document.body.scrollHeight : 0
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' })
  }, 10)
}

const handleTransitionEnd = () => {
  if (!moreFilters.value) {
    moreFiltersTransition.value = false
  }
}
</script>
