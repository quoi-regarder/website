import { defineStore } from 'pinia'

export const useMovieListStore = defineStore('movie_list', {
  state: (): { movieList: Tables<'user_movie_lists'>[] } => ({
    movieList: []
  }),
  getters: {
    getToWatchCount: (state) =>
      computed(() => state.movieList.filter((m) => m.status === 'to_watch').length),
    getMovieByTmdbId: (state) => (tmdbId: number) => {
      return state.movieList.find((m) => m.tmdb_id === tmdbId)
    }
  },
  actions: {
    addMovie (movie: Tables<'user_movie_lists'>) {
      const existingMovie = this.getMovieByTmdbId(movie.tmdb_id)
      if (existingMovie) {
        this.movieList = this.movieList.map((m) => (m.tmdb_id === movie.tmdb_id ? movie : m))
      } else {
        this.movieList.push(movie)
      }
    },
    removeMovie (id: number) {
      this.movieList = this.movieList.filter((m) => m.tmdb_id !== id)
    },
    setMovies (movieList: Tables<'user_movie_lists'>[]) {
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
