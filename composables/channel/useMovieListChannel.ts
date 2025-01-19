import type { RealtimeChannel } from '@supabase/channel-js'

export const useMovieListChannel = () => {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const movieList = ref<Tables<'user_movie_lists'> | null>(null)
  let movieListChannel: RealtimeChannel | null = null
  const { setMovies, removeMovie, addMovie } = useMovieListStoreStore()

  const fetchMovieList = async () => {
    if (!user.value) return
    try {
      const manager = new QueryParamsManager(`/api/movie-lists/${user.value.id}`)

      movieList.value = await $fetch(manager.toString(), {
        method: 'GET'
      })
      setMovies(movieList.value)
    } catch (error: any) {
      console.error('Error fetching movie list:', error)
    }
  }

  const setupChannel = () => {
    if (!user.value) return

    movieListChannel = client.channel('movie-list').on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_movie_lists',
        filter: `user_id=eq.${user.value?.id}`
      },
      (payload: any) => {
        if (payload.eventType === 'DELETE') {
          removeMovie(payload.old.tmdb_id)
        } else {
          addMovie(payload.new)
        }
      }
    )
    movieListChannel.subscribe()
  }

  const cleanupChannel = () => {
    if (movieListChannel) {
      movieListChannel.unsubscribe()
      movieListChannel = null
    }
  }

  onMounted(() => {
    if (!user.value) return

    fetchMovieList().then(
      () => {
        setupChannel()
      },
      (error) => {
        console.error('Error fetching movie list:', error)
      }
    )
  })

  onUnmounted(() => {
    cleanupChannel()
  })

  return {
    movieList
  }
}
