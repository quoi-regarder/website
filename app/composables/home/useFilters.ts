export const useFilters = () => {
  const filtersStore = useFiltersStore()

  const selectedType = computed({
    get () {
      return filtersStore.selectedType
    },
    set (value) {
      filtersStore.setSelectedType(value)
    }
  })

  const filters = computed({
    get () {
      return selectedType.value === 'movie' ? filtersStore.movieFilters : filtersStore.tvFilters
    },
    set (value) {
      if (selectedType.value === 'movie') {
        filtersStore.movieFilters = value
      } else {
        filtersStore.tvFilters = value
      }
    }
  })

  const resetFilters = () => {
    filtersStore.resetFilters(selectedType.value)
  }

  const isMovieTypeActive = computed(() => selectedType.value === 'movie')
  const isTvTypeActive = computed(() => selectedType.value === 'tv')

  const isDefaultState = computed(() => filtersStore.isDefaultState(selectedType.value))

  return {
    selectedType,
    filters,
    resetFilters,
    isMovieTypeActive,
    isTvTypeActive,
    isDefaultState
  }
}
