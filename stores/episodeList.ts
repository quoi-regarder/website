import { defineStore } from 'pinia'

export const useEpisodeListStore = defineStore('episode_list', {
  state: (): { episodeList: SerieEpisodeWatchlist[] } => ({
    episodeList: []
  }),
  getters: {
    getToWatchCount: (state) =>
      computed(() => state.episodeList?.filter((s) => s.status === WatchStatus.TO_WATCH).length),
    getWatchedCount: (state) =>
      computed(() => state.episodeList?.filter((s) => s.status === WatchStatus.WATCHED).length),
    getEpisodeByTmdbId: (state) => (tmdbId: number) => {
      return state.episodeList.find((s) => {
        return s.tmdbId.toString() === tmdbId.toString()
      })
    }
  },
  actions: {
    addEpisode (episode: SerieEpisodeWatchlist) {
      this.episodeList = this.episodeList.filter((s) => s.tmdbId !== episode.tmdbId)
      this.episodeList.push(episode)
    },
    updateEpisode (episode: SerieEpisodeWatchlist) {
      this.episodeList = this.episodeList.map((s) =>
        s.tmdbId === episode.tmdbId ? { ...s, ...episode } : s
      )
    },
    removeEpisode (episode: SerieEpisodeWatchlist) {
      this.episodeList = this.episodeList.filter((s) => s.tmdbId !== episode.tmdbId)
    },
    setEpisodes (episodeList: SerieEpisodeWatchlist[]) {
      this.episodeList = episodeList
    },
    reset () {
      this.episodeList = []
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
