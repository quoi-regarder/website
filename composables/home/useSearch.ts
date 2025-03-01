interface SearchResult {
  results: any[]
  total_pages: number
  page: number
}

const totalPage = ref(0)
const page = ref(1)
const pagePool = ref<number[]>([])
const results = ref<any[]>([])
const isSearching = ref(false)

export const useSearch = () => {
  const { isDefaultState, filters, selectedType } = useFilters()
  const { t, locale } = useI18n()

  const initializePagePool = () => {
    if (selectedType.value === 'movie') {
      pagePool.value = Array.from({ length: 150 }, (_, i) => i + 1).sort(() => Math.random() - 0.5)
    } else {
      pagePool.value = Array.from({ length: 30 }, (_, i) => i + 1).sort(() => Math.random() - 0.5)
    }
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
      const manager = new QueryParamsManager(`/api/themoviedb/discover/${selectedType.value}`)
      handleQuery(manager)

      const data = await $fetch<SearchResult>(manager.toString())

      if (data) {
        results.value = [...results.value, ...data.results]
        totalPage.value = data.total_pages
        page.value = data.page
      }
    } catch (e) {
      console.error('Error while searching', e)
    } finally {
      isSearching.value = false

      if (results.value.length === 0) {
        useNotifications().info(t('common.toasts.title.info'), t('home.toasts.error.search'))
      } else if (showToast) {
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

    if (filters.value?.selectedType === 'movie') {
      handleExclusiveMovieFilters(manager)
    } else {
      handleExclusiveTvFilters(manager)
    }
  }

  const handleCommonFilters = (manager: QueryParamsManager) => {
    manager.add('page', page.value)
    manager.add('language', locale.value)

    const currentFilters = filters.value

    if (currentFilters?.selectedGenres && currentFilters.selectedGenres.length > 0) {
      manager.addWithLogic(
        'with_genres',
        currentFilters.selectedGenres.map((genre) => genre.id),
        LogicalOperator.AND
      )
    }

    if (currentFilters?.selectedPlatforms && currentFilters.selectedPlatforms.length > 0) {
      manager.addWithLogic(
        'with_watch_providers',
        currentFilters.selectedPlatforms.map((platform) => platform.id),
        LogicalOperator.OR
      )
    }

    if (currentFilters?.selectedVotes !== undefined && currentFilters.selectedVotes !== 0) {
      manager.add('vote_count_gte', currentFilters.selectedVotes)
    }

    if (
      currentFilters?.selectedFilterBy !== null &&
      currentFilters?.selectedFilterByDirection !== null
    ) {
      manager.add(
        'sort_by',
        `${currentFilters.selectedFilterBy}.${currentFilters.selectedFilterByDirection}`
      )
    }

    if (currentFilters?.selectedCompanies && currentFilters.selectedCompanies.length > 0) {
      manager.addWithLogic(
        'with_companies',
        currentFilters.selectedCompanies.map((company) => company.id),
        LogicalOperator.OR
      )
    }

    if (currentFilters?.selectedMark !== undefined && currentFilters.selectedMark !== 0) {
      manager.add('vote_average_gte', currentFilters.selectedMark)
    }

    if (currentFilters?.selectedAges && currentFilters.selectedAges.length > 0) {
      manager.addWithLogic(
        'certification',
        currentFilters.selectedAges.map((age) => age.id),
        LogicalOperator.OR
      )
    }

    if (currentFilters?.selectedDuration && currentFilters.selectedDuration[0] !== 0) {
      manager.add('with_runtime_gte', currentFilters.selectedDuration[0])
    }

    if (currentFilters?.selectedDuration && currentFilters.selectedDuration[1] !== 400) {
      manager.add('with_runtime_lte', currentFilters.selectedDuration[1])
    }

    if (currentFilters?.selectedMonetization && currentFilters.selectedMonetization.length > 0) {
      manager.addWithLogic(
        'with_watch_monetization_types',
        currentFilters.selectedMonetization.map((monetization) => monetization.id),
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
    const currentFilters = filters.value

    if (currentFilters?.selectedPersons && currentFilters.selectedPersons.length > 0) {
      manager.addWithLogic(
        'with_people',
        currentFilters.selectedPersons.map((person) => person.id),
        LogicalOperator.OR
      )
    }

    if (currentFilters?.fromDate !== null && currentFilters?.fromDate !== undefined) {
      manager.add('release_date_gte', currentFilters.fromDate.toString())
    }

    if (currentFilters?.toDate !== null && currentFilters?.toDate !== undefined) {
      manager.add('release_date_lte', currentFilters.toDate.toString())
    }
  }

  const handleExclusiveTvFilters = (manager: QueryParamsManager) => {
    const currentFilters = filters.value

    if (currentFilters?.fromDate !== null && currentFilters?.fromDate !== undefined) {
      manager.add('first_air_date_gte', currentFilters.fromDate.toString())
    }

    if (currentFilters?.toDate !== null && currentFilters?.toDate !== undefined) {
      manager.add('first_air_date_lte', currentFilters.toDate.toString())
    }

    if (currentFilters?.airFromDate !== null && currentFilters?.airFromDate !== undefined) {
      manager.add('air_date_gte', currentFilters.airFromDate.toString())
    }

    if (currentFilters?.airToDate !== null && currentFilters?.airToDate !== undefined) {
      manager.add('air_date_lte', currentFilters.airToDate.toString())
    }
  }

  watch(selectedType, () => {
    resetSearch()
  })

  return {
    search,
    isSearching,
    nextPage,
    results,
    resetSearch,
    hasResults: computed(() => results.value.length > 0)
  }
}
