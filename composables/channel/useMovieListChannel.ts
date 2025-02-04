import { Transmit } from '@adonisjs/transmit-client'

export const useMovieListChannel = () => {
  const movieListStore = useMovieListStore()
  const movieWatchlistService = useMovieWatchlistService()
  const authStore = useAuthStore()
  const transmit = shallowRef<Transmit | null>(null)
  const movies = ref<MovieWatchlist[] | null>(null)
  const runtimeConfig = useRuntimeConfig()

  const fetchMovieList = async () => {
    const response: ApiResponse = await movieWatchlistService.getWatchlist(authStore.getUserId)

    if (response.status === 'error') {
      return
    }

    movies.value = response.data as MovieWatchlist[]

    movieListStore.setMovies(movies.value)
  }

  const setupChannel = async () => {
    if (!transmit.value || !authStore.getUserId) return

    try {
      const subscription = transmit.value.subscription(`movie_watchlist:${authStore.getUserId}`)
      await subscription.create()

      subscription.onMessage((data: any) => {
        switch (data?.type) {
          case 'add':
            movieListStore.addMovie(data.movie)
            break
          case 'update':
            movieListStore.updateMovie(data.movie)
            break
          case 'remove':
            movieListStore.removeMovie(data.movie)
            break
        }
      })
    } catch (error) {
      console.error('Failed to setup channel:', error)
    }
  }

  onMounted(async () => {
    if (authStore.isAuthenticated === false) return

    transmit.value = new Transmit({
      baseUrl: runtimeConfig.public.apiBaseUrl
    })

    await fetchMovieList()
    await setupChannel()
  })

  onUnmounted(() => {
    transmit.value?.close()
    transmit.value = null
  })
}
