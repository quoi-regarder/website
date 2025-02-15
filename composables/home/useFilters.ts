const defaultState: FilterState = {
  selectedType: 'movie',
  selectedGenres: [],
  selectedPlatforms: [],
  selectedMark: 0,
  selectedFilterBy: null,
  selectedFilterByDirection: null,
  selectedAges: [],
  selectedDuration: [0, 400],
  selectedMonetization: [],
  selectedVotes: 500,
  selectedPersons: [],
  selectedCompanies: [],
  fromDate: null,
  toDate: null,
  airFromDate: null,
  airToDate: null
}

const filters = ref<FilterState>({ ...defaultState })

export const useFilters = () => {
  const resetFilters = () => {
    Object.keys(defaultState).forEach((key) => {
      resetOneFilter(key as keyof FilterState)
    })
  }

  const resetOneFilter = (key: keyof FilterState) => {
    if (key === 'selectedType') return

    if (key === 'selectedDuration') {
      filters.value.selectedDuration = [0, 400]
      return
    }

    if (Array.isArray(defaultState[key])) {
      filters.value[key] = []
    } else {
      filters.value[key] = defaultState[key]
    }
  }

  const isDefaultState = computed(() => {
    return Object.entries(defaultState).every(([key, value]) => {
      if (key === 'selectedType') return true

      const currentValue = filters.value[key as keyof FilterState]

      if (Array.isArray(value)) {
        return (
          Array.isArray(currentValue) &&
          currentValue.length === value.length &&
          currentValue.every((val, index) => val === value[index])
        )
      }

      return currentValue === value
    })
  })

  const isMovieTypeActive = computed(() => filters.value.selectedType === 'movie')
  const isTvTypeActive = computed(() => filters.value.selectedType === 'tv')

  // watch type change
  watch(
    () => filters.value.selectedType,
    () => {
      resetFilters()
    }
  )

  return {
    filters,
    resetFilters,
    resetOneFilter,
    isDefaultState,
    isMovieTypeActive,
    isTvTypeActive
  }
}
