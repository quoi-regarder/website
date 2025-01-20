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

  const fetchMovieWithRetry = async (
    tmdbId: number,
    maxRetries = 3,
    retryDelay = 100
  ): Promise<Tables<'user_movie_list'> | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, retryDelay))

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const manager = new QueryParamsManager(
          `/api/user-movie-list-with-translation/${user.value?.id}/${tmdbId}`
        )
        manager.add('language', locale.value)

        const data = await $fetch<Tables<'user_movie_list'>>(manager.toString(), {
          method: 'GET'
        })

        if (data && data.tmdb_id !== undefined) {
          return data
        }

        await new Promise((resolve) => setTimeout(resolve, retryDelay))
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error)

        if (attempt === maxRetries - 1) {
          throw error
        }

        await new Promise((resolve) => setTimeout(resolve, retryDelay))
      }
    }
    return undefined
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
        try {
          if (payload.eventType === 'DELETE') {
            removeMovie(payload.old.tmdb_id)
          } else if (payload.eventType === 'UPDATE') {
            updateMovie(payload.new)
          } else {
            const movie = await fetchMovieWithRetry(payload.new.tmdb_id)
            if (movie) {
              addMovie(movie)
            }
          }
        } catch (error) {
          console.error('Error processing realtime update:', error)
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
