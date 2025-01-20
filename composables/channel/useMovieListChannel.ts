import type { RealtimeChannel } from '@supabase/channel-js'

export const useMovieListChannel = () => {
  const { setMovies, removeMovie, addMovie, updateMovie } = useMovieListStore()
  let movieListChannel: RealtimeChannel | null = null
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const { locale } = useI18n()

  const fetchMovieList = async () => {
    if (!user.value) return
    try {
      const manager = new QueryParamsManager(
        `/api/user-movie-list-with-translation/${user.value.id}`
      )
      manager.add('language', locale.value)

      const data: Tables<'user_movie_list'>[] = await $fetch(manager.toString(), {
        method: 'GET'
      })

      setMovies(data)
    } catch (error: any) {
      console.error('Error fetching movie list:', error)
    }
  }

  const fetchMovie = async (tmdbId: number) => {
    try {
      const manager = new QueryParamsManager(
        `/api/user-movie-list-with-translation/${user.value?.id}/${tmdbId}`
      )
      manager.add('language', locale.value)

      const data: Tables<'user_movie_list'> = await $fetch(manager.toString(), {
        method: 'GET'
      })

      return data
    } catch (error: any) {
      console.error('Error fetching movie:', error)
    }
  }

  const setupChannel = () => {
    if (!user.value) return

    movieListChannel = client.channel('movie-list').on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_movie_list',
        filter: `user_id=eq.${user.value?.id}`
      },
      async (payload: any) => {
        if (payload.eventType === 'DELETE') {
          removeMovie(payload.old.tmdb_id)
        } else if (payload.eventType === 'UPDATE') {
          updateMovie(payload.new)
        } else {
          const movie: Tables<'user_movie_list'> | undefined = await fetchMovie(payload.new.tmdb_id)
          if (!movie) {
            return
          }
          addMovie(movie)
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
}
