import { defineStore } from 'pinia'

export const useSerieListStore = defineStore('serie_list', {
  state: (): { serieList: SerieWatchlist[] } => ({
    serieList: []
  }),
  getters: {
    getToWatchCount: (state) =>
      computed(() => state.serieList?.filter((s) => s.status === WatchStatus.TO_WATCH).length),
    getWatchedCount: (state) =>
      computed(() => state.serieList?.filter((s) => s.status === WatchStatus.WATCHED).length),
    getSerieByTmdbId: (state) => (tmdbId: number) => {
      return state.serieList.find((s) => {
        return s.tmdbId.toString() === tmdbId.toString()
      })
    }
  },
  actions: {
    addSerie (serie: SerieWatchlist) {
      this.serieList = this.serieList.filter((s) => s.tmdbId !== serie.tmdbId)
      this.serieList.push(serie)
    },
    updateSerie (serie: SerieWatchlist) {
      this.serieList = this.serieList.map((s) =>
        s.tmdbId === serie.tmdbId ? { ...s, ...serie } : s
      )
    },
    removeSerie (serie: SerieWatchlist) {
      this.serieList = this.serieList.filter((s) => s.tmdbId !== serie.tmdbId)
    },
    setSeries (serieList: SerieWatchlist[]) {
      this.serieList = serieList
    },
    reset () {
      this.serieList = []
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
