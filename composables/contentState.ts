export const useContentState = () => {
  const { getMovieByTmdbId } = useMovieListStoreStore()
  const localPath = useLocalePath()
  const user = useSupabaseUser()
  const { t } = useI18n()

  const getContentFromList = (
    type: 'movie' | 'tv',
    id: number
  ): Tables<'user_movie_lists'> | undefined => {
    if (!user.value) {
      return undefined
    }

    if (type === 'movie') {
      return getMovieByTmdbId(id) as Tables<'user_movie_lists'>
    } else {
      // TODO: Get TV show from list
    }
  }

  const isContentWatched = (type: 'movie' | 'tv', id: number) => {
    if (!user.value) {
      return false
    }

    const content = getContentFromList(type, id)

    if (!content) {
      return false
    }

    return content.status === 'watched'
  }

  const isContentToWatch = (type: 'movie' | 'tv', id: number) => {
    if (!user.value) {
      return false
    }

    const content = getContentFromList(type, id)

    if (!content) {
      return false
    }

    return content.status === 'to_watch'
  }

  const addContentToWatchlist = async (type: 'movie' | 'tv', id: number) => {
    if (type === 'movie') {
      return addMovieToList(id, 'to_watch', type, getContentFromList(type, id))
    } else {
      // TODO: Add TV show to watchlist
    }
  }

  const addContentToViewedList = async (type: 'movie' | 'tv', id: number) => {
    if (type === 'movie') {
      addMovieToList(id, 'watched', type, getContentFromList(type, id))
    } else {
      // TODO: Add TV show to watched list
    }
  }

  const addMovieToList = async (
    movie_id: number | string,
    status: Enums<'movie_list_status'>,
    type: 'movie' | 'tv',
    movie?: Tables<'user_movie_lists'>
  ) => {
    if (!user.value) {
      navigateTo(localPath('/auth/login'))
    }

    if (movie && movie.status === status) {
      $fetch(`/api/movie-lists/${user.value.id}/movie/${movie_id}`, {
        method: 'DELETE'
      })

      useNotifications().success(
        t('common.toasts.title.success'),
        t(`common.content.toasts.success.${type}.removedFromList.${status}`)
      )

      return
    }

    $fetch(`/api/movie-lists/${user.value.id}/movie/${movie_id}`, {
      method: 'POST',
      body: {
        status
      }
    })

    useNotifications().success(
      t('common.toasts.title.success'),
      t(`common.content.toasts.success.${type}.addedToList.${status}`)
    )
  }

  return {
    isContentWatched,
    isContentToWatch,
    addContentToWatchlist,
    addContentToViewedList
  }
}
