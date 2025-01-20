import { defineStore } from 'pinia'

export const useMovieListStore = defineStore('movie_list', {
  state: (): { movieList: Tables<'user_movie_list'>[] } => ({
    movieList: []
  }),
  getters: {
    getToWatchCount: (state) =>
      computed(() => state.movieList?.filter((m) => m.status === 'to_watch').length),
    getToWatchList: (state) =>
      computed(() => state.movieList?.filter((m) => m.status === 'to_watch')),
    getWatchedCount: (state) =>
      computed(() => state.movieList?.filter((m) => m.status === 'watched').length),
    getWatchedList: (state) =>
      computed(() => state.movieList?.filter((m) => m.status === 'watched')),
    getTotalRuntime: (state) =>
      computed(() =>
        state.movieList
          ?.filter((m) => m.status === 'watched')
          .reduce((acc, m) => acc + m.runtime, 0)
      ),
    getMovieByTmdbId: (state) => (tmdbId: number) => {
      return state.movieList.find((m) => m.tmdb_id === tmdbId)
    },
    getMovieList: (state) => computed(() => state.movieList)
  },
  actions: {
    addMovie (movie: Tables<'user_movie_list'>) {
      this.movieList = this.movieList.filter((m) => m.tmdb_id !== movie.tmdb_id)
      this.movieList.push(movie)
    },
    updateMovie (movie: Tables<'user_movie_list'>) {
      this.movieList = this.movieList.map((m) =>
        m.tmdb_id === movie.tmdb_id ? { ...m, status: movie.status } : m
      )
    },
    removeMovie (id: number) {
      this.movieList = this.movieList.filter((m) => m.tmdb_id !== id)
    },
    setMovies (movieList: Tables<'user_movie_list'>[]) {
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
