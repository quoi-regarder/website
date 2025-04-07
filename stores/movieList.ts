export const useMovieListStore = defineStore('movie_list', {
  state: (): { watchedIds: number[]; toWatchIds: number[] } => ({
    watchedIds: [],
    toWatchIds: []
  }),
  getters: {
    getWatchedCount: (state) => state.watchedIds?.length,
    getToWatchCount: (state) => state.toWatchIds?.length,
    getIdStatus: (state) => (id: number) => {
      if (state.watchedIds.map(Number).includes(id)) {
        return WatchStatus.WATCHED
      }
      if (state.toWatchIds.map(Number).includes(id)) {
        return WatchStatus.TO_WATCH
      }
      return null
    },
    getWatchedIds: (state) => state.watchedIds.map(Number)
  },
  actions: {
    setWatchedIds (ids: number[]) {
      this.watchedIds = ids
    },
    setToWatchIds (ids: number[]) {
      this.toWatchIds = ids
    },
    reset () {
      this.watchedIds = []
      this.toWatchIds = []
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
