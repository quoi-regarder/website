<template>
  <div class="relative flex flex-col gap-y-8">
    <!-- Back to top button -->
    <UButton
      :class="{
        'opacity-100 visible': showButton,
        'opacity-0 invisible': !showButton
      }"
      class="fixed top-24 left-1/2 -translate-x-1/2 z-50 rounded-xl shadow-lg transition-all ease-in duration-500"
      size="xl"
      variant="solid"
      :label="$t('common.buttons.backToTop')"
      @click="scrollToTop"
    >
      <template #trailing>
        <UIcon name="i-heroicons-arrow-up" class="size-6" />
      </template>
    </UButton>

    <!-- Background Image -->
    <NuxtImg
      alt="Background image"
      class="absolute object-cover w-full h-[60vh] opacity-50 bg-gradient-radial z-0"
      src="/img/background.webp"
      format="webp"
      preload
    />

    <!-- Content Section -->
    <UContainer
      :class="{
        'lg:min-h-[35vh]': showCarousel,
        'lg:min-h-[55vh]': !showCarousel
      }"
      class="w-full flex flex-col items-center justify-center gap-4 transition-all duration-500 ease-out relative"
    >
      <h1 class="text-4xl text-[var(--ui-color-primary-400)] font-bold text-center mb-2">
        {{ $t('home.title') }}
      </h1>
      <h2 class="text-lg font-semibold text-center mb-8">{{ $t('home.subtitle') }}</h2>

      <div class="flex items-center justify-center gap-4">
        <UTooltip :text="$t('home.form.tooltip.reset')">
          <UButton
            icon="i-heroicons-arrow-path-rounded-square"
            size="xl"
            variant="outline"
            @click="resetSeachAndFilters"
          />
        </UTooltip>
        <UButton
          id="searchButton"
          :loading="searching"
          icon="i-heroicons-magnifying-glass"
          size="xl"
          @click="searchQuery(true)"
        >
          {{ $t('home.form.buttons.search') }}
        </UButton>
      </div>
      <div class="flex flex-col mt-4">
        <FilterType v-model="selectedType" @update:model-value="resetSeachAndFilters" />
      </div>
    </UContainer>

    <!-- Carousel Section -->
    <div
      id="carousel"
      :class="{ 'opacity-100': showCarousel, 'opacity-0': !showCarousel }"
      class="w-full flex items-center justify-center overflow-hidden transition-all duration-500 ease-in relative z-10"
    >
      <UCarousel
        v-if="showCarousel && results.length > 0"
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

    <!-- Bottom Section -->
    <div
      class="w-full flex flex-col overflow-hidden transition-all duration-500 ease-out relative z-10"
    >
      <div class="grid grid-cols-1 xl:grid-cols-5 gap-4 p-4">
        <FilterGenre
          ref="genreFilterRef"
          v-model="genres"
          :type="selectedType"
          class="xl:col-span-3 xl:row-span-2 h-full"
          @update:selected-genres="selectedGenres = $event"
        />
        <FilterPlatform
          ref="platformFilterRef"
          class="xl:col-span-2 xl:row-span-1 h-full"
          :type="selectedType"
          @update:selected-platforms="selectedPlatforms = $event"
        />

        <FilterVotes
          ref="votesFilterRef"
          class="xl:col-span-2 xl:row-span-1 h-full"
          @update:selected-votes="selectedVotes = $event"
        />
      </div>

      <UButton class="my-4 self-center" size="xl" variant="link" @click="toggleMoreFilters">
        <div class="flex flex-col items-center justify-center">
          <span>{{ $t('home.form.buttons.moreFilters') }}</span>
          <UIcon
            :class="{ 'rotate-180': moreFilters }"
            class="text-[var(--ui-color-primary-400)] size-6 transition-all duration-300"
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
        'opacity-100 visible': moreFilters,
        'opacity-0 invisible': !moreFilters
      }"
      class="grid grid-cols-1 items-center xl:grid-cols-6 gap-4 p-4 transition-all duration-1000 ease-in-out"
      @transitionend="handleTransitionEnd"
    >
      <FilterBy
        ref="filterByRef"
        class="xl:col-span-4 xl:row-span-1 order-1 xl:order-none h-full"
        :type="selectedType"
        @update:selected-by="selectedFilterBy = $event"
        @update:direction="selectedFilterByDirection = $event"
      />

      <FilterPerson
        v-if="displayMovieFilters"
        ref="personFilterRef"
        class="xl:col-span-2 xl:row-span-1 order-2 xl:order-none h-full"
        @update:selected-persons="selectedPersons = $event"
      />

      <FilterMonetization
        ref="monetizationFilterRef"
        class="xl:col-span-2 xl:row-span-1 order-4 xl:order-none h-full"
        @update:selected-monetization="selectedMonetization = $event"
      />

      <FilterDateRange
        v-if="displaySeriesFilters"
        ref="airDateFilterRef"
        class="xl:col-span-2 xl:row-span-1 order-5 xl:order-none h-full"
        :title="$t('dateRange.air_date')"
        @update:from-date="airFromDate = $event"
        @update:to-date="airToDate = $event"
      />

      <FilterDateRange
        ref="yearFilterRef"
        class="xl:col-span-2 xl:row-span-1 order-5 xl:order-none h-full"
        :title="selectedType === 'movie' ? $t('dateRange.title') : $t('dateRange.first_air_date')"
        @update:from-date="fromDate = $event"
        @update:to-date="toDate = $event"
      />

      <FilterCompany
        ref="companyFilterRef"
        class="xl:col-span-2 xl:row-span-1 order-3 xl:order-none h-full"
        @update:selected-companies="selectedCompanies = $event"
      />

      <FilterAge
        ref="ageFilterRef"
        class="xl:col-span-2 xl:row-span-1 order-6 xl:order-none h-full"
        @update:selected-ages="selectedAges = $event"
      />

      <FilterMark
        ref="markFilterRef"
        class="xl:col-span-2 xl:row-span-1 order-7 xl:order-none h-full"
        @update:selected-mark="selectedMark = $event"
      />

      <FilterDuration
        ref="durationFilterRef"
        class="xl:col-span-2 xl:row-span-1 order-8 xl:order-none h-full"
        @update:duration="selectedDuration = $event"
      />
    </div>

    <USeparator class="w-full" />

    <!-- Footer -->
    <UContainer
      class="w-full p-8 mb-8 rounded-2xl shadow-2xl bg-gradient-to-br from-[var(--ui-bg-elevated)] via-[var(--ui-bg-muted)] to-[var(--ui-bg-elevated)] text-center space-y-6"
    >
      <h2 class="text-2xl font-bold mb-4 text-[var(--ui-color-primary-400)]">
        {{ $t('home.footer.title') }}
      </h2>

      <p class="leading-relaxed">
        {{ $t('home.footer.description.first') }}
      </p>

      <p class="leading-relaxed">
        {{ $t('home.footer.description.second') }}
      </p>

      <p class="leading-relaxed">
        {{ $t('home.footer.description.third') }}
      </p>

      <p class="leading-relaxed">
        {{ $t('home.footer.description.fourth') }}
      </p>

      <p class="text-lg font-semibold">
        {{ $t('home.footer.description.join') }}
      </p>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
import type { CalendarDate } from '@internationalized/date'
const authService = useAuthService()
const localPath = useLocalePath()
const { locale, t } = useI18n()
const route = useRoute()

useHead({
  title: t('seo.title'),
  meta: [{ hid: 'description', name: 'description', content: t('seo.description') }]
})

// Filters state
const selectedType = ref<'movie' | 'tv'>('movie')
const displayMovieFilters = computed(() => selectedType.value === 'movie')
const displaySeriesFilters = computed(() => selectedType.value === 'tv')
const selectedGenres = ref<Option[]>([])
const selectedPlatforms = ref<Option[]>([])
const selectedMark = ref<number>(0)
const selectedFilterBy = ref<string | null>(null)
const selectedFilterByDirection = ref<'asc' | 'desc' | null>(null)
const selectedAges = ref<Option[]>([])
const selectedDuration = ref<number[]>([0, 0])
const selectedMonetization = ref<Option[]>([])
const selectedVotes = ref<number | null>(null)
const selectedPersons = ref<Option[]>([])
const selectedCompanies = ref<Option[]>([])
const fromDate = ref<CalendarDate | null>(null)
const toDate = ref<CalendarDate | null>(null)
const airFromDate = ref<CalendarDate | null>(null)
const airToDate = ref<CalendarDate | null>(null)

// Filters refs
const genreFilterRef = ref()
const platformFilterRef = ref()
const markFilterRef = ref()
const filterByRef = ref()
const personFilterRef = ref()
const monetizationFilterRef = ref()
const yearFilterRef = ref()
const airDateFilterRef = ref()
const companyFilterRef = ref()
const ageFilterRef = ref()
const votesFilterRef = ref()
const durationFilterRef = ref()

// Data
const genres = ref<Option[]>([])
const moreFilters = ref(false)

// Carousel
const searching = ref(false)
const carousel = useTemplateRef('carousel')
const showCarousel = ref(false)

// Transition
const moreFiltersTransition = ref(false)

// Results
const results = ref([])

// Pagination
const page = ref(1)
const totalPages = ref(0)

// Scroll to top
const showButton = ref(false)

onMounted(() => {
  handleRegisterToken()

  window.addEventListener('scroll', checkSearchButtonVisibility)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkSearchButtonVisibility)
})

// Méthodes
const searchQuery = async (reset = false, showToast = true) => {
  if (reset) {
    resetSearchState()
  }

  if (page.value > totalPages.value && totalPages.value !== 0) return
  searching.value = true

  try {
    const manager = new QueryParamsManager(`/api/themoviedb/discover/${selectedType.value}`)
    handleQueryFilters(manager)

    const data = await $fetch(manager.toString())

    page.value = data.page
    totalPages.value = data.total_pages
    results.value = [...results.value, ...data.results]
  } catch (error) {
    console.error('Error fetching movies:', error)
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

const handleQueryFilters = (manager: QueryParamsManager) => {
  commonFilters(manager)

  if (selectedType.value === 'movie') {
    exclusiveMovieFilters(manager)
  } else {
    exclusiveSeriesFilters(manager)
  }

  return manager
}

// Filters
const commonFilters = (manager: QueryParamsManager) => {
  manager.add('language', locale.value)
  manager.add('page', page.value)

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
      LogicalOperator.OR
    )
  }

  if (selectedMark.value !== 0) {
    manager.add('vote_average_gte', selectedMark.value)
  }

  if (selectedFilterBy.value !== null && selectedFilterByDirection.value !== null) {
    manager.add('sort_by', `${selectedFilterBy.value}.${selectedFilterByDirection.value}`)
  }

  if (selectedCompanies.value.length > 0) {
    manager.addWithLogic(
      'with_companies',
      selectedCompanies.value.map((company) => company.id),
      LogicalOperator.OR
    )
  }

  if (selectedVotes.value !== null) {
    manager.add('vote_count_gte', selectedVotes.value)
  }

  if (selectedAges.value.length > 0) {
    manager.addWithLogic(
      'certification',
      selectedAges.value.map((age) => age.id),
      LogicalOperator.AND
    )
  }

  if (selectedDuration.value[0] !== 0) {
    manager.add('with_runtime_gte', selectedDuration.value[0])
  }

  if (selectedDuration.value[1] !== 0) {
    manager.add('with_runtime_lte', selectedDuration.value[1])
  }
}

const exclusiveMovieFilters = (manager: QueryParamsManager) => {
  if (selectedPersons.value.length > 0) {
    manager.addWithLogic(
      'with_people',
      selectedPersons.value.map((person) => person.id),
      LogicalOperator.AND
    )
  }

  if (fromDate.value !== null) {
    manager.add('release_date_gte', fromDate.value.toString())
  }

  if (toDate.value !== null) {
    manager.add('release_date_lte', toDate.value.toString())
  }

  if (selectedMonetization.value.length > 0) {
    manager.addWithLogic(
      'with_watch_monetization_types',
      selectedMonetization.value.map((monetization) => monetization.id),
      LogicalOperator.OR
    )
  }
}

const exclusiveSeriesFilters = (manager: QueryParamsManager) => {
  if (fromDate.value !== null) {
    manager.add('first_air_date_gte', fromDate.value.toString())
  }

  if (toDate.value !== null) {
    manager.add('first_air_date_lte', toDate.value.toString())
  }

  if (airFromDate.value !== null) {
    manager.add('air_date_gte', airFromDate.value.toString())
  }

  if (airToDate.value !== null) {
    manager.add('air_date_lte', airToDate.value.toString())
  }

  if (selectedMonetization.value.length > 0) {
    manager.addWithLogic(
      'with_watch_monetization_types',
      selectedMonetization.value.map((monetization) => monetization.id),
      LogicalOperator.OR
    )
  } else {
    manager.addWithLogic(
      'with_watch_monetization_types',
      ['flatrate', 'free', 'ads', 'rent', 'buy'],
      LogicalOperator.OR
    )
  }
}

const toggleMoreFilters = () => {
  moreFilters.value = !moreFilters.value
  moreFiltersTransition.value = true
  setTimeout(() => {
    const scrollTarget = moreFilters.value ? document.getElementById('filters')?.offsetTop : 0
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' })
  }, 10)
}

// Scroll to top
const checkSearchButtonVisibility = () => {
  const searchButton = document.getElementById('searchButton')
  if (searchButton) {
    const rect = searchButton.getBoundingClientRect()
    showButton.value = rect.top < 0 || rect.bottom > window.innerHeight
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Reset
const resetSearchState = () => {
  results.value = []
  page.value = 1
  totalPages.value = 0
}

const resetSeachAndFilters = () => {
  resetSearchState()
  showCarousel.value = false
  resetFilters()
}

const resetFilters = () => {
  genreFilterRef.value?.reset()
  platformFilterRef.value?.reset()
  markFilterRef.value?.reset()
  filterByRef.value?.reset()
  personFilterRef.value?.reset()
  monetizationFilterRef.value?.reset()
  yearFilterRef.value?.reset()
  companyFilterRef.value?.reset()
  ageFilterRef.value?.reset()
  votesFilterRef.value?.reset()
  durationFilterRef.value?.reset()
}

// Transition
const handleTransitionEnd = () => {
  if (!moreFilters.value) {
    moreFiltersTransition.value = false
  }
}

// Register token
const handleRegisterToken = async () => {
  const token = route.query.token
  if (!token) return
  const response: ApiResponse = await authService.verifyEmail(token as string)

  if (response.status === 'error') {
    navigateTo(localPath('/'))
    return
  }

  await navigateTo(localPath('/'))
  useNotifications().success(t('common.toasts.title.success'), t('home.toasts.success.token'))
}

// Watchers
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
