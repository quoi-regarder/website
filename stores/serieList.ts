import { defineStore } from 'pinia'

export const useSerieListStore = defineStore('serie_list', {
  state: (): { watchedIds: number[]; watchingIds: number[]; toWatchIds: number[] } => ({
    watchedIds: [],
    watchingIds: [],
    toWatchIds: []
  }),
  getters: {
    getWatchedCount: (state) => state.watchedIds?.length,
    getWatchingCount: (state) => state.watchingIds?.length,
    getToWatchCount: (state) => state.toWatchIds?.length,
    getIdStatus: (state) => (id: number) => {
      if (state.watchedIds.map(Number).includes(id)) {
        return WatchStatus.WATCHED
      }
      if (state.watchingIds.map(Number).includes(id)) {
        return WatchStatus.WATCHING
      }
      if (state.toWatchIds.map(Number).includes(id)) {
        return WatchStatus.TO_WATCH
      }
      return null
    }
  },
  actions: {
    setWatchedIds (ids: number[]) {
      this.watchedIds = ids
    },
    setWatchingIds (ids: number[]) {
      this.watchingIds = ids
    },
    setToWatchIds (ids: number[]) {
      this.toWatchIds = ids
    },
    reset () {
      this.watchedIds = []
      this.watchingIds = []
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
