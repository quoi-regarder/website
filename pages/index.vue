<template>
  <div class="relative flex flex-col gap-8 laptop:gap-0">
    <!-- Header -->

    <!-- Background Image -->
    <NuxtImg
      alt="Background image"
      class="absolute object-cover w-full h-[60vh] opacity-50 bg-gradient-radial z-0"
      src="/img/background.webp"
    />

    <!-- Content Section -->
    <div
      :class="{
        'min-h-[30vh] laptop:min-h-[15vh]': showCarousel,
        'min-h-[30vh] laptop:min-h-[55vh]': !showCarousel
      }"
      class="w-full flex flex-col items-center justify-center gap-4 transition-all duration-500 ease-out relative z-10"
    >
      <h1 class="text-4xl font-bold text-center mb-2">{{ $t('home.title') }}</h1>
      <h2 class="text-lg font-semibold text-center mb-8">{{ $t('home.subtitle') }}</h2>

      <div class="flex items-center justify-center gap-4">
        <UTooltip :text="$t('home.form.tooltip.reset')" :popper="{ arrow: true }">
          <UButton
            icon="i-heroicons-arrow-path-rounded-square"
            size="xl"
            variant="outline"
            @click="resetSeachAndFilters"
          />
        </UTooltip>
        <UButton
          :loading="searching"
          icon="i-heroicons-magnifying-glass"
          size="xl"
          @click="searchQuery(true)"
        >
          {{ $t('home.form.buttons.search') }}
        </UButton>
      </div>
      <div
        class="flex flex-col mt-4 tablet:gap-x-4 w-11/12 tablet-md:w-[60%] laptop:w-[50%] desktop:w-[40%]"
      >
        <FilterType ref="typeFilterRef" @update:model-value="modelValue = $event" />

        <!-- <FilterKeyword class="w-full" @update:selected-keywords="selectedKeywords = $event" /> -->
      </div>
    </div>

    <!-- Carousel Section -->
    <div
      :class="{ 'opacity-100 min-h-[70vh]': showCarousel, 'opacity-0': !showCarousel }"
      class="w-full flex items-center justify-center overflow-hidden transition-all duration-500 ease-in relative z-10"
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
            class="mx-auto h-fit w-[98%] tablet:w-[90%] laptop:w-[80%] desktop:w-[60%] fullhd:w-[50%] flex flex-col items-start"
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
      class="w-full flex flex-col overflow-hidden transition-all duration-500 ease-out relative z-10"
      :class="{
        'min-h-[0vh] tablet:min-h-[0vh]': moreFilters,
        'min-h-[0vh] tablet:min-h-[45vh]': !moreFilters
      }"
    >
      <div class="grid grid-cols-1 items-center laptop-md:grid-cols-5 gap-4 p-4">
        <FilterGenre
          ref="genreFilterRef"
          class="laptop-md:col-span-3 laptop-md:row-span-2"
          @update:genres="genres = $event"
          @update:selected-genres="selectedGenres = $event"
        />
        <FilterPlatform
          ref="platformFilterRef"
          class="laptop-md:col-span-2 laptop-md:row-span-1"
          @update:selected-platforms="selectedPlatforms = $event"
          @update:platforms="platforms = $event"
        />
        <FilterMark
          ref="markFilterRef"
          class="laptop-md:col-span-2 laptop-md:row-span-1"
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
      id="filters"
      :class="{
        'min-h-fit opacity-100 visible': moreFilters,
        'min-h-0 opacity-0 invisible': !moreFilters
      }"
      class="grid grid-cols-1 items-center laptop-md:grid-cols-6 gap-4 p-4 transition-all duration-1000 ease-in-out"
      @transitionend="handleTransitionEnd"
    >
      <FilterBy
        ref="filterByRef"
        class="laptop-md:col-span-4 laptop-md:row-span-1 order-1 laptop-md:order-none"
        @update:selected-by="selectedFilterBy = $event"
        @update:direction="selectedFilterByDirection = $event"
      />

      <FilterPerson
        ref="personFilterRef"
        class="laptop-md:col-span-2 laptop-md:row-span-1 order-2 laptop-md:order-none"
        @update:selected-persons="selectedPersons = $event"
      />

      <FilterMonetization
        ref="monetizationFilterRef"
        class="laptop-md:col-span-2 laptop-md:row-span-1 order-4 laptop-md:order-none"
        @update:selected-monetization="selectedMonetization = $event"
      />

      <FilterYear
        ref="yearFilterRef"
        class="laptop-md:col-span-2 laptop-md:row-span-1 order-5 laptop-md:order-none"
        @update:from-date="fromDate = $event"
        @update:to-date="toDate = $event"
      />

      <FilterCompany
        ref="companyFilterRef"
        class="laptop-md:col-span-2 laptop-md:row-span-1 order-3 laptop-md:order-none"
        @update:selected-companies="selectedCompanies = $event"
      />

      <FilterAge
        ref="ageFilterRef"
        class="laptop-md:col-span-2 laptop-md:row-span-1 order-6 laptop-md:order-none"
        @update:selected-ages="selectedAges = $event"
      />

      <FilterVotes
        ref="votesFilterRef"
        class="laptop-md:col-span-2 laptop-md:row-span-1 order-7 laptop-md:order-none"
        @update:selected-votes="selectedVotes = $event"
        @update:mode="selectedVotesMode = $event"
      />

      <FilterDuration
        ref="durationFilterRef"
        class="laptop-md:col-span-2 laptop-md:row-span-1 order-8 laptop-md:order-none"
        @update:selected-duration="selectedDuration = $event"
        @update:mode="selectedDurationMode = $event"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { format } from 'date-fns'

const { locale, t } = useI18n()

useHead({
  title: t('seo.title'),
  meta: [{ hid: 'description', name: 'description', content: t('seo.description') }]
})

// Filters state
const selectedType = ref<'movie' | 'series'>('movie')
// const selectedKeywords = ref<Badge[]>([])
const selectedGenres = ref<Badge[]>([])
const selectedPlatforms = ref<Option[]>([])
const selectedMark = ref<number>(0)
const selectedFilterBy = ref<string | null>(null)
const selectedFilterByDirection = ref<Direction | null>(null)
const selectedAges = ref<Badge[]>([])
const selectedDuration = ref<number | null>(null)
const selectedDurationMode = ref<'min' | 'max' | null>(null)
const selectedMonetization = ref<Option[]>([])
const selectedVotes = ref<number | null>(null)
const selectedVotesMode = ref<'min' | 'max' | null>(null)
const selectedPersons = ref<Option[]>([])
const selectedCompanies = ref<Option[]>([])
const fromDate = ref<Date | null>(null)
const toDate = ref<Date | null>(null)

// Filters refs
const typeFilterRef = ref()
const genreFilterRef = ref()
const platformFilterRef = ref()
const markFilterRef = ref()
const filterByRef = ref()
const personFilterRef = ref()
const monetizationFilterRef = ref()
const yearFilterRef = ref()
const companyFilterRef = ref()
const ageFilterRef = ref()
const votesFilterRef = ref()
const durationFilterRef = ref()

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

    if (movies.value.length > 0) {
      showCarousel.value = true

      if (showToast) {
        useNotifications().success(
          t('common.toasts.title.success'),
          t('home.toasts.success.search')
        )
      }
    } else {
      showCarousel.value = false
      useNotifications().info(t('common.toasts.title.info'), t('home.toasts.error.search'))
    }
  }
}

const resetSearchState = () => {
  movies.value = []
  page.value = 1
  totalPages.value = 0
}

const resetSeachAndFilters = () => {
  resetSearchState()
  showCarousel.value = false
  typeFilterRef.value.reset()
  genreFilterRef.value.reset()
  platformFilterRef.value.reset()
  markFilterRef.value.reset()
  filterByRef.value.reset()
  personFilterRef.value.reset()
  monetizationFilterRef.value.reset()
  yearFilterRef.value.reset()
  companyFilterRef.value.reset()
  ageFilterRef.value.reset()
  votesFilterRef.value.reset()
  durationFilterRef.value.reset()
}

const handleQueryFilters = (manager: QueryParamsManager) => {
  manager.add('language', locale.value)
  manager.add('page', page.value)

  // if (selectedKeywords.value.length > 0) {
  //   manager.addWithLogic(
  //     'with_keywords',
  //     selectedKeywords.value.map((keyword) => keyword.id),
  //     LogicalOperator.AND
  //   )
  // }

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

  if (selectedFilterBy.value !== null && selectedFilterByDirection.value !== null) {
    manager.add('sort_by', `${selectedFilterBy.value}.${selectedFilterByDirection.value}`)
  }

  if (selectedDuration.value !== null && selectedDurationMode.value !== null) {
    if (selectedDurationMode.value === 'min') {
      manager.add('with_runtime_gte', selectedDuration.value)
    } else {
      manager.add('with_runtime_lte', selectedDuration.value)
    }
  }

  if (selectedAges.value.length > 0) {
    manager.addWithLogic(
      'certification',
      selectedAges.value.map((age) => age.id),
      LogicalOperator.AND
    )
  }
  if (fromDate.value !== null) {
    manager.add('release_date_gte', format(fromDate.value, 'yyyy-MM-dd'))
  }

  if (toDate.value !== null) {
    manager.add('release_date_lte', format(toDate.value, 'yyyy-MM-dd'))
  }

  if (selectedMonetization.value.length > 0) {
    manager.addWithLogic(
      'with_watch_monetization_types',
      selectedMonetization.value.map((monetization) => monetization.id),
      LogicalOperator.OR
    )
  }

  if (selectedVotes.value !== null && selectedVotesMode.value !== null) {
    if (selectedVotesMode.value === 'min') {
      manager.add('vote_count_gte', selectedVotes.value)
    } else {
      manager.add('vote_count_lte', selectedVotes.value)
    }
  }

  if (selectedPersons.value.length > 0) {
    manager.addWithLogic(
      'with_people',
      selectedPersons.value.map((person) => person.id),
      LogicalOperator.AND
    )
  }

  if (selectedCompanies.value.length > 0) {
    manager.addWithLogic(
      'with_companies',
      selectedCompanies.value.map((company) => company.id),
      LogicalOperator.OR
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
    const scrollTarget = moreFilters.value ? document.getElementById('filters').offsetTop : 0
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' })
  }, 10)
}

const handleTransitionEnd = () => {
  if (!moreFilters.value) {
    moreFiltersTransition.value = false
  }
}
</script>

<style scoped>
.bg-gradient-radial {
  background: radial-gradient(circle, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 0.7) 100%);
  mask-image: radial-gradient(circle, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 1) 100%);
  -webkit-mask-image: radial-gradient(circle, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 1) 100%);
}
</style>
