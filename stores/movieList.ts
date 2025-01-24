import { defineStore } from 'pinia'
import { WatchStatus } from '../types/watchStatus'

export const useMovieListStore = defineStore('movie_list', {
  state: (): { movieList: MovieWatchlist[] } => ({
    movieList: []
  }),
  getters: {
    getToWatchCount: (state) =>
      computed(() => state.movieList?.filter((m) => m.status === WatchStatus.TO_WATCH).length),
    getWatchedCount: (state) =>
      computed(() => state.movieList?.filter((m) => m.status === WatchStatus.WATCHED).length),
    getTotalRuntime: (state) =>
      computed(() =>
        state.movieList
          ?.filter((m) => m.status === WatchStatus.WATCHED)
          .reduce((acc, m) => acc + m?.movie?.runtime, 0)
      ),
    getMovieByTmdbId: (state) => (tmdbId: number) => {
      return state.movieList.find((m) => {
        return m.tmdbId.toString() === tmdbId.toString()
      })
    }
  },
  actions: {
    addMovie (movie: MovieWatchlist) {
      this.movieList = this.movieList.filter((m) => m.tmdbId !== movie.tmdbId)
      this.movieList.push(movie)
    },
    updateMovie (movie: MovieWatchlist) {
      this.movieList = this.movieList.map((m) =>
        m.tmdbId === movie.tmdbId ? { ...m, ...movie } : m
      )
    },
    removeMovie (movie: MovieWatchlist) {
      this.movieList = this.movieList.filter((m) => m.tmdbId !== movie.tmdbId)
    },
    setMovies (movieList: MovieWatchlist[]) {
      this.movieList = movieList
    },
    reset () {
      this.movieList = []
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
