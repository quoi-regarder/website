<template>
  <div class="flex flex-col gap-8">
    <!-- Header -->
    <div
      :class="{
        'min-h-[30vh] laptop:min-h-[15vh]': showCarousel,
        'min-h-[30vh] tablet:min-h-[52vh]': !showCarousel
      }"
      class="w-full flex flex-col items-center justify-center gap-4 transition-all duration-500 ease-out"
    >
      <UButton
        :loading="searching"
        class="h-fit tablet-md:mt-[-1rem]"
        icon="i-heroicons-magnifying-glass"
        size="xl"
        @click="searchQuery(true)"
      >
        {{ $t('home.form.buttons.search') }}
      </UButton>
      <div
        class="flex flex-col justify-center tablet:gap-x-4 tablet-md:w-[60%] laptop:w-[50%] desktop:w-[40%]"
      >
        <!-- <FieldMultiSelect
          name="search"
          :label="$t('home.form.fields.search')"
          :description="$t('home.form.descriptions.search')"
          :api-to-fecth="'/api/themoviedb/search/keyword'"
          :options="selectedKeywords"
          class="w-full"
          @update:selected-keywords="console.log($event)"
        /> -->

        <HomeKeyword class="w-full" @update:selected-keywords="selectedKeywords = $event" />
      </div>
    </div>

    <!-- Carousel Section -->
    <div
      :class="{ 'opacity-100 min-h-[70vh]': showCarousel, 'opacity-0': !showCarousel }"
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
    <div class="w-full flex flex-col overflow-hidden">
      <div class="grid grid-cols-1 items-center desktop:grid-cols-5 gap-4 p-4">
        <HomeGenre
          class="desktop:col-span-3 desktop:row-span-2"
          @update:genres="genres = $event"
          @update:selected-genres="selectedGenres = $event"
        />
        <HomePlatforms
          class="desktop:col-span-2 desktop:row-span-1"
          @update:selected-platforms="selectedPlatforms = $event"
          @update:platforms="platforms = $event"
        />
        <HomeMark
          class="desktop:col-span-2 desktop:row-span-1"
          @update:selected-mark="selectedMark = $event"
        />
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
      class="grid grid-cols-1 items-center desktop:grid-cols-5 gap-4 p-4 transition-all duration-1000 ease-in-out"
      @transitionend="handleTransitionEnd"
    >
      <HomeType
        class="desktop:col-span-3 desktop:row-span-1"
        @update:selected-types="selectedTypes = $event"
      />

      <HomeYear
        class="desktop:col-span-2 desktop:row-span-1"
        @update:selected-years="selectedYears = $event"
      />

      <HomeFilter
        class="desktop:col-span-3 desktop:row-span-1"
        @update:selected-filter="selectedFilter = $event"
      />

      <HomeDirector
        class="desktop:col-span-2 desktop:row-span-1"
        @update:selected-directors="selectedDirectors = $event"
      />

      <HomeAge
        class="desktop:col-span-3 desktop:row-span-1"
        @update:selected-ages="selectedAges = $event"
      />

      <HomeActor
        class="desktop:col-span-2 desktop:row-span-1"
        @update:selected-actors="selectedActors = $event"
      />
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
const selectedKeywords = ref<Badge[]>([])
const selectedGenres = ref<Badge[]>([])
const selectedPlatforms = ref<Option[]>([])
const selectedMark = ref<number>(0)
const selectedTypes = ref([])
const selectedFilter = ref<Badge[]>([])
const selectedAges = ref<Badge[]>([])
const selectedYears = ref([])
const selectedDirectors = ref([])
const selectedActors = ref([])

// Data
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

  if (selectedKeywords.value.length > 0) {
    manager.addWithLogic(
      'with_keywords',
      selectedKeywords.value.map((keyword) => keyword.id),
      LogicalOperator.AND
    )
  }

  if (selectedGenres.value.length > 0) {
    manager.addWithLogic(
      'with_genres',
      selectedGenres.value.map((genre) => genre.id),
      LogicalOperator.AND
    )
  }

  if (selectedPlatforms.value.length > 0) {
    manager.addWithLogic(
      'with_watch_providers',
      selectedPlatforms.value.map((platform) => platform.id),
      LogicalOperator.AND
    )
  }

  if (selectedMark.value !== 0) {
    manager.add('vote_average_gte', selectedMark.value)
  }

  if (selectedFilter.value.length > 0) {
    manager.add('sort_by', selectedFilter.value[0].id)
  }

  if (selectedAges.value.length > 0) {
    manager.addWithLogic(
      'certification',
      selectedAges.value.map((age) => age.id),
      LogicalOperator.AND
    )
  }

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
