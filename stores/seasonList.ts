import { defineStore } from 'pinia'
import type { SerieSeasonWatchlist } from '../models/serieSeasonWatchlist'

export const useSeasonListStore = defineStore('season_list', {
  state: (): { seasonList: SerieSeasonWatchlist[] } => ({
    seasonList: []
  }),
  getters: {
    getToWatchCount: (state) =>
      state.seasonList.filter((s) => s.status === WatchStatus.TO_WATCH).length,
    getWatchedCount: (state) =>
      state.seasonList.filter((s) => s.status === WatchStatus.WATCHED).length,
    getSeasonByTmdbId: (state) => (tmdbId: number) => {
      return state.seasonList.find((s) => {
        return s.tmdbId.toString() === tmdbId.toString()
      })
    }
  },
  actions: {
    addSeason (season: SerieSeasonWatchlist) {
      this.seasonList = this.seasonList.filter((s) => s.tmdbId !== season.tmdbId)
      this.seasonList.push(season)
    },
    updateSeason (season: SerieSeasonWatchlist) {
      this.seasonList = this.seasonList.map((s) =>
        s.tmdbId === season.tmdbId ? { ...s, ...season } : s
      )
    },
    removeSeason (season: SerieSeasonWatchlist) {
      this.seasonList = this.seasonList.filter((s) => s.tmdbId !== season.tmdbId)
    },
    setSeasons (seasonList: SerieSeasonWatchlist[]) {
      this.seasonList = seasonList
    },
    reset () {
      this.seasonList = []
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
