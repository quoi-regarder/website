import { Transmit } from '@adonisjs/transmit-client'

export const useMovieListChannel = () => {
  const { addMovie, updateMovie, removeMovie, setMovies } = useMovieListStore()
  const movieWatchlistService = useMovieWatchlistService()
  const { isAuthenticated, getUserId } = useAuthStore()
  const transmit = shallowRef<Transmit | null>(null)
  const movies = ref<MovieWatchlist[] | null>(null)
  const runtimeConfig = useRuntimeConfig()

  const fetchMovieList = async () => {
    const fetchedMovieList: MovieWatchlist = await movieWatchlistService.getWatchlist(
      getUserId.value
    )

    if (!fetchedMovieList) {
      throw new Error('Failed to fetch movie list')
    }

    movies.value = fetchedMovieList as unknown as MovieWatchlist[]

    setMovies(movies.value)
  }

  const setupChannel = async () => {
    if (!transmit.value || !getUserId.value) return

    try {
      const subscription = transmit.value.subscription(`movie_watchlist:${getUserId.value}`)
      await subscription.create()

      subscription.onMessage((data: any) => {
        switch (data?.type) {
          case 'add':
            addMovie(data.movie)
            break
          case 'update':
            updateMovie(data.movie)
            break
          case 'remove':
            removeMovie(data.movie)
            break
        }
      })
    } catch (error) {
      console.error('Failed to setup channel:', error)
    }
  }

  onMounted(async () => {
    if (!isAuthenticated.value) return

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
