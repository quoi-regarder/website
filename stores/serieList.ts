import { defineStore } from 'pinia'

export const useSerieListStore = defineStore('serie_list', {
  state: (): { serieList: Tables<'user_serie_lists'>[] } => ({
    serieList: []
  }),
  getters: {
    getToWatchCount: (state) =>
      computed(() => state.serieList.filter((m) => m.status === 'to_watch').length),
    getSerieByTmdbId: (state) => (tmdbId: number) => {
      return state.serieList.find((m) => m.tmdb_id === tmdbId)
    }
  },
  actions: {
    // addSerie (serie: Tables<'user_serie_lists'>) {
    //   const existingSerie = this.getSerieByTmdbId(serie.tmdb_id)
    //   if (existingSerie) {
    //     this.serieList = this.serieList.map((m) => (m.tmdb_id === serie.tmdb_id ? serie : m))
    //   } else {
    //     this.serieList.push(serie)
    //   }
    // },
    // removeSerie (id: number) {
    //   this.serieList = this.serieList.filter((m) => m.tmdb_id !== id)
    // },
    // setSeries (serieList: Tables<'user_serie_lists'>[]) {
    //   this.serieList = serieList
    // },
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
