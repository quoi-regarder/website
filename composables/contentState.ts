export const useContentState = () => {
  const { getMovieByTmdbId } = useMovieListStore()
  const localPath = useLocalePath()
  const user = useSupabaseUser()
  const { t } = useI18n()

  const getContentFromList = (
    type: 'movie' | 'tv',
    id: number
  ): Tables<'user_movie_list'> | undefined => {
    if (!user.value) {
      return undefined
    }

    if (type === 'movie') {
      return getMovieByTmdbId(id) as Tables<'user_movie_list'>
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
      return addMovieToList(id, 'to_watch', type)
    } else {
      // TODO: Add TV show to watchlist
    }
  }

  const addContentToViewedList = async (type: 'movie' | 'tv', id: number) => {
    if (type === 'movie') {
      addMovieToList(id, 'watched', type)
    } else {
      // TODO: Add TV show to watched list
    }
  }

  const addMovieToList = async (
    movie_id: number,
    status: Enums<'movie_list_status'>,
    type: 'movie' | 'tv'
  ) => {
    if (!user.value) {
      navigateTo(localPath('/auth/login'))
    }

    useMovie().addMovieToList(movie_id, status)

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
