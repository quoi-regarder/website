const getDefaultState = (): Partial<FilterState> => ({
  selectedGenres: [],
  selectedPlatforms: [],
  selectedMark: 0,
  selectedFilterBy: undefined,
  selectedFilterByDirection: undefined,
  selectedAges: [],
  selectedDuration: [0, 400],
  selectedMonetization: [],
  selectedVotes: 50,
  selectedPersons: [],
  selectedCompanies: [],
  fromDate: null,
  toDate: null,
  airFromDate: null,
  airToDate: null
})

export const useFiltersStore = defineStore('filters', {
  state: (): {
    selectedType: 'movie' | 'tv'
    movieFilters: Partial<FilterState>
    tvFilters: Partial<FilterState>
  } => ({
    selectedType: 'movie',
    movieFilters: getDefaultState(),
    tvFilters: getDefaultState()
  }),
  actions: {
    setSelectedType (type: 'movie' | 'tv') {
      this.selectedType = type
    },
    resetFilters (type: 'movie' | 'tv') {
      if (type === 'movie') {
        this.movieFilters = getDefaultState()
      } else if (type === 'tv') {
        this.tvFilters = getDefaultState()
      }
    },
    isDefaultState (type: 'movie' | 'tv') {
      const defaultState = getDefaultState()
      if (type === 'movie') {
        return JSON.stringify(this.movieFilters) === JSON.stringify(defaultState)
      } else if (type === 'tv') {
        return JSON.stringify(this.tvFilters) === JSON.stringify(defaultState)
      }
      return false
    }
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sameSite: 'strict',
      secure: true
    })
  }
})
