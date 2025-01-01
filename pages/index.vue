<template>
  <div class="flex flex-col">
    <ClientOnly>
      <!-- Header -->
      <div
        :class="{
          'h-[30vh] laptop:h-[15vh]': movies.length > 0,
          'h-[30vh] tablet:h-[52vh]': movies.length === 0
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
              @click="searchQuery(page)"
            >
              {{ $t('home.form.buttons.search') }}
            </UButton>
          </div>
        </div>
      </div>

      <!-- Carousel Section -->
      <div
        :class="{ 'opacity-100': movies.length > 0, 'opacity-0': movies.length === 0 }"
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
              class="mx-auto w-[98%] h-fit laptop:w-4/5 desktop:w-2/3 fullhd:w-1/2 flex flex-col items-start"
            >
              <MovieCard :genres="allGenres" :movie="item" />
            </div>
          </template>
          <template #next="{ onClick, disabled }">
            <UButton
              :disabled="disabled"
              :ui="{ rounded: 'rounded-full' }"
              class="absolute right-2 top-[calc(3/2*100vw-1rem)] laptop:top-1/2"
              icon="i-heroicons-chevron-right"
              variant="soft"
              @click="onClick"
            />
          </template>
          <template #prev="{ onClick, disabled }">
            <UButton
              :disabled="disabled"
              :ui="{ rounded: 'rounded-full' }"
              class="absolute left-2 top-[calc(3/2*100vw-1rem)] laptop:top-1/2"
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
          'min-h-[50vh] opacity-100': movies.length > 0,
          'min-h-[40vh] opacity-100': movies.length === 0
        }"
        class="w-full flex flex-col overflow-hidden transition-all duration-500 ease-out"
      >
        <div class="flex w-full p-4 gap-4">
          <div class="flex flex-col gap-4 items-center justify-center w-3/5">
            <HomeGenre
              @update:selected-genres="selectedGenres = $event"
              @update:genres="allGenres = $event"
            />
          </div>
          <div class="border-r-2 border-gray-200 dark:border-gray-500"></div>
          <div class="flex flex-col gap-4 items-center justify-center w-2/5">
            <HomePlatforms @update:selected-platforms="selectedPlatforms = $event" />
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
      >
        <div class="flex flex-col gap-4 items-center justify-center w-3/5">
          <HomeType @update:selected-types="selectedTypes = $event" />
          <HomeAge @update:selected-ages="selectedAges = $event" />
          <HomeFilter @update:selected-filter="selectedFilter = $event" />
        </div>
        <div class="border-r-2 border-gray-200 dark:border-gray-500"></div>
        <div class="flex flex-col gap-4 items-center justify-center w-2/5">
          <HomeYear @update:selected-years="selectedYears = $event" />
          <HomeDirector @update:selected-directors="selectedDirectors = $event" />
          <HomeActor @update:selected-actors="selectedActors = $event" />
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
const { locale } = useI18n()

// Filters state
const selectedPlatforms = ref([])
const selectedTypes = ref([])
const selectedGenres = ref([])
const selectedAges = ref([])
const selectedFilter = ref([])
const selectedMark = ref(1)
const selectedYears = ref([])
const selectedDirectors = ref([])
const selectedActors = ref([])

// Data
const allGenres = ref([])

const searching = ref(false)
const movies = ref([])
const carouselRef = ref()
const page = ref(1)
const totalPages = ref(0)
const moreFilters = ref(false)
const moreFiltersTransition = ref(false)
const search = ref('')

// Méthodes
const searchQuery = async (newPage) => {
  if (newPage > totalPages.value && totalPages.value !== 0) return
  searching.value = true
  try {
    const manager = new QueryParamsManager('/api/themoviedb/discover/movie')
    manager.add('language', locale.value)
    manager.add('page', newPage)

    const data = await $fetch(manager.toString())

    page.value = data.page
    totalPages.value = data.total_pages
    movies.value = [...movies.value, ...data.results]
  } catch (error) {
    console.error('Error fetching movies:', error)
  } finally {
    searching.value = false
  }
}

watch(
  () => carouselRef.value?.page,
  (currentPage) => {
    if (!carouselRef.value) return
    const isLastPage = currentPage === carouselRef.value.pages - 2
    if (isLastPage && page.value < totalPages.value) {
      searchQuery(page.value + 1)
    }
  }
)

const toggleMoreFilters = () => {
  moreFilters.value = !moreFilters.value
  moreFiltersTransition.value = true
  setTimeout(() => {
    const scrollTarget = moreFilters.value ? document.body.scrollHeight : 0
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' })
  }, 1)
}
</script>
