const totalPage = ref(0)
const page = ref(1)

const pagePool = ref<number[]>([])

const results = ref<[]>([])

const isSearching = ref(false)

export const useSearch = () => {
  const { isDefaultState, filters } = useFilters()
  const { t, locale } = useI18n()

  const initializePagePool = () => {
    pagePool.value = Array.from({ length: 150 }, (_, i) => i + 1).sort(() => Math.random() - 0.5)
  }

  const resetPagePool = () => {
    pagePool.value = []
  }

  const search = async (showToast = true) => {
    isSearching.value = true

    if (isDefaultState.value) {
      if (pagePool.value.length === 0) {
        initializePagePool()
      }
      page.value = pagePool.value.shift() || 1
    } else {
      resetPagePool()
    }

    try {
      const manager = new QueryParamsManager(
        `/api/themoviedb/discover/${filters.value.selectedType}`
      )
      handleQuery(manager)

      const data: any = await $fetch(manager.toString())

      if (data) {
        results.value = [...results.value, ...data.results]
        totalPage.value = data.total_pages
        page.value = data.page
      }
    } catch (e) {
      console.error('Error while searching', e)
    } finally {
      isSearching.value = false

      if (showToast) {
        useNotifications().success(
          t('common.toasts.title.success'),
          t('home.toasts.success.search')
        )
      }
    }
  }

  const nextPage = () => {
    if (isDefaultState.value) {
      if (pagePool.value.length === 0) {
        initializePagePool()
      }
      page.value = pagePool.value.shift() || 1
    } else {
      if (page.value < totalPage.value) {
        page.value += 1
      }
    }
    search(false)
  }

  const resetSearch = () => {
    results.value = []
    totalPage.value = 0
    page.value = 1
  }

  const handleQuery = (manager: QueryParamsManager) => {
    handleCommonFilters(manager)

    if (filters.value.selectedType === 'movie') {
      handleExclusiveMovieFilters(manager)
    } else {
      handleExclusiveTvFilters(manager)
    }
  }

  const handleCommonFilters = (manager: QueryParamsManager) => {
    manager.add('page', page.value)
    manager.add('language', locale.value)

    if (filters.value.selectedGenres.length > 0) {
      manager.addWithLogic(
        'with_genres',
        filters.value.selectedGenres.map((genre) => genre.id),
        LogicalOperator.AND
      )
    }

    if (filters.value.selectedPlatforms.length > 0) {
      manager.addWithLogic(
        'with_watch_providers',
        filters.value.selectedPlatforms.map((platform) => platform.id),
        LogicalOperator.OR
      )
    }

    if (filters.value.selectedVotes !== 0) {
      manager.add('vote_count_gte', filters.value.selectedVotes)
    }

    if (
      filters.value.selectedFilterBy !== null &&
      filters.value.selectedFilterByDirection !== null
    ) {
      manager.add(
        'sort_by',
        `${filters.value.selectedFilterBy}.${filters.value.selectedFilterByDirection}`
      )
    }

    if (filters.value.selectedCompanies.length > 0) {
      manager.addWithLogic(
        'with_companies',
        filters.value.selectedCompanies.map((company) => company.id),
        LogicalOperator.OR
      )
    }

    if (filters.value.selectedMark !== 0) {
      manager.add('vote_average_gte', filters.value.selectedMark)
    }

    if (filters.value.selectedAges.length > 0) {
      manager.addWithLogic(
        'certification',
        filters.value.selectedAges.map((age) => age.id),
        LogicalOperator.OR
      )
    }

    if (filters.value.selectedDuration[0] !== 0) {
      manager.add('with_runtime_gte', filters.value.selectedDuration[0])
    }

    if (filters.value.selectedDuration[1] !== 400) {
      manager.add('with_runtime_lte', filters.value.selectedDuration[1])
    }

    if (filters.value.selectedMonetization.length > 0) {
      manager.addWithLogic(
        'with_watch_monetization_types',
        filters.value.selectedMonetization.map((monetization) => monetization.id),
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

  const handleExclusiveMovieFilters = (manager: QueryParamsManager) => {
    if (filters.value.selectedPersons.length > 0) {
      manager.addWithLogic(
        'with_people',
        filters.value.selectedPersons.map((person) => person.id),
        LogicalOperator.OR
      )
    }

    if (filters.value.fromDate !== null) {
      manager.add('release_date_gte', filters.value.fromDate.toString())
    }

    if (filters.value.toDate !== null) {
      manager.add('release_date_lte', filters.value.toDate.toString())
    }
  }

  const handleExclusiveTvFilters = (manager: QueryParamsManager) => {
    if (filters.value.fromDate !== null) {
      manager.add('first_air_date_gte', filters.value.fromDate.toString())
    }

    if (filters.value.toDate !== null) {
      manager.add('first_air_date_lte', filters.value.toDate.toString())
    }

    if (filters.value.airFromDate !== null) {
      manager.add('air_date_gte', filters.value.airFromDate.toString())
    }

    if (filters.value.airToDate !== null) {
      manager.add('air_date_lte', filters.value.airToDate.toString())
    }
  }

  return {
    search,
    isSearching,
    nextPage,
    results,
    resetSearch,
    hasResults: computed(() => results.value.length > 0)
  }
}
