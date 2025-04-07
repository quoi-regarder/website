export const useMovieFavoriteStore = defineStore('movie_favorite', {
  state: (): { ids: number[] } => ({
    ids: []
  }),
  getters: {
    getIds: (state) => state.ids,
    isIdFavorite: (state) => {
      return (id: number) => state.ids?.includes(id)
    },
    getCount: (state) => state.ids?.length
  },
  actions: {
    setIds (ids: number[]) {
      this.ids = ids
    },
    reset () {
      this.ids = []
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
