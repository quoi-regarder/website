type ContentType = 'movie' | 'tv' | 'season' | 'episode'

export const useContentState = () => {
  const movieWatchlistService: WatchlistService = useMovieWatchlistService()
  const serieWatchlistService: WatchlistService = useSerieWatchlistService()
  const seasonWatchlistService: WatchlistService = useSeasonWatchlistService()
  const episodeWatchlistService: WatchlistService = useEpisodeWatchlistService()

  const authStore = useAuthStore()
  const localPath = useLocalePath()
  const { t } = useI18n()

  const getServiceAndStore = (type: ContentType) => {
    switch (type) {
      case 'movie':
        return { service: movieWatchlistService, store: useMovieListStore() }
      case 'tv':
        return { service: serieWatchlistService, store: useSerieListStore() }
      case 'season':
        return { service: seasonWatchlistService, store: useSeasonListStore() }
      case 'episode':
        return { service: episodeWatchlistService, store: useEpisodeListStore() }
      default:
        throw new Error(`Unsupported content type: ${type}`)
    }
  }

  /**
   *
   * @param type Content type (movie, tv, season, episode)
   * @param typeId Content ID
   * @returns Watch status (to_watch, watching, watched)
   *
   * @description Get the watch status of a content.
   *
   * Precisions:
   * - If we want to get the status of a season, the typeId should be the season ID. etc.
   */
  const getContentStatus = (type: ContentType, typeId: number): WatchStatus | null => {
    if (!authStore.isAuthenticated) return null

    switch (type) {
      case 'movie':
        return useMovieListStore().getIdStatus(typeId)
      case 'tv':
        return useSerieListStore().getIdStatus(typeId)
      case 'season':
        return useSeasonListStore().getIdStatus(typeId)
      case 'episode':
        return useEpisodeListStore().getIdStatus(typeId)
      default:
        throw new Error(`Unsupported content type: ${type}`)
    }
  }

  /**
   *
   * @param type Content type (movie, tv, season, episode)
   * @param primaryId Primary content ID
   * @param status Watch status (to_watch, watching, watched)
   * @param contentId Content ID (optional)
   * @param seasonNumber Season number (optional)
   * @returns void
   *
   * @description Add content to watchlist or viewed list.
   * If the content is already in the list, it will be removed.
   * If the content is in the list with a different status, it will be updated.
   * If the content is not in the list, it will be added.
   *
   * Precisions:
   * - If we are adding a movie, the primaryId should be the movie ID. Other IDs should be null.
   * - If we are adding a serie, the primaryId should be the serie ID. Other IDs should be null.
   * - If we are adding a season, the primaryId should be the serie ID and the contentId should be the season ID.
   * - If we are adding an episode, the primaryId should be the serie ID and the contentId should be the episode ID and the seasonNumber should be the season number.
   */
  const addContentToList = async (
    type: ContentType,
    primaryId: number,
    status: WatchStatus,
    contentId?: number | null,
    seasonNumber?: number | null
  ) => {
    if (!authStore.isAuthenticated) {
      navigateTo(localPath('/auth/login'))
      return
    }

    const idOfContent = contentId || primaryId

    const { service } = getServiceAndStore(type)
    const contentStatus = getContentStatus(type, idOfContent)

    if (contentStatus !== null) {
      if (contentStatus === status) {
        const response: ApiResponse<any> = await service.removeWatchlist(
          authStore.getUserId,
          idOfContent,
          primaryId
        )

        if (!response.success) {
          return
        }

        useNotifications().success(
          t('common.toasts.title.success'),
          t(`common.content.toasts.success.${type}.removedFromList.${status}`)
        )
      } else {
        const response: ApiResponse<any> = await service.updateWatchlist(
          authStore.getUserId,
          idOfContent,
          status,
          primaryId
        )

        if (!response.success) {
          return
        }

        useNotifications().success(
          t('common.toasts.title.success'),
          t(`common.content.toasts.success.${type}.addedToList.${status}`)
        )
      }
    } else {
      const watch: MovieWatchlist | SerieWatchlist | SerieSeasonWatchlist | SerieEpisodeWatchlist =
        {
          userId: authStore.getUserId,
          tmdbId: idOfContent,
          status: status,
          seasonNumber: seasonNumber
        }

      service.createWatchlist(authStore.getUserId, watch, primaryId)
      useNotifications().success(
        t('common.toasts.title.success'),
        t(`common.content.toasts.success.${type}.addedToList.${status}`)
      )
    }
  }

  return {
    getContentStatus,
    addContentToWatchlist: (
      type: ContentType,
      primaryId: number,
      seasonId?: number | null,
      seasonNumber?: number | null
    ) => addContentToList(type, primaryId, WatchStatus.TO_WATCH, seasonId, seasonNumber),
    addContentToViewedList: (
      type: ContentType,
      primaryId: number,
      seasonId?: number | null,
      seasonNumber?: number | null
    ) => addContentToList(type, primaryId, WatchStatus.WATCHED, seasonId, seasonNumber)
  }
}
