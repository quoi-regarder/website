export const useFavoriteState = () => {
  const movieFavoriteService: FavoriteService = useMovieFavoriteService()

  const localPath = useLocalePath()
  const authStore = useAuthStore()
  const { t } = useI18n()

  const getServiceAndStore = (type: ContentType) => {
    switch (type) {
      case 'movie':
        return {
          service: movieFavoriteService,
          store: useMovieFavoriteStore()
        }
      default:
        throw new Error(`Unsupported content type: ${type}`)
    }
  }

  const isFavorite = (type: ContentType, typeId: number): boolean => {
    if (!authStore.isAuthenticated) return false

    switch (type) {
      case 'movie':
        return useMovieFavoriteStore().isIdFavorite(typeId)
      default:
        throw new Error(`Unsupported content type: ${type}`)
    }
  }

  const addFavorite = async (type: ContentType, typeId: number) => {
    if (!authStore.isAuthenticated) {
      navigateTo(localPath('/auth/login'))
      return
    }

    const { service, store } = getServiceAndStore(type)

    if (isFavorite(type, typeId)) {
      const response: ApiResponse<any> = await service.removeFavorite(authStore.getUserId, typeId)

      if (!response.success) {
        return
      }

      useNotifications().success(
        t('common.toasts.title.success'),
        t(`common.favorite.toasts.success.${type}.removedFromList`)
      )
      return
    }

    const favorite: MovieFavorite = {
      userId: authStore.getUserId,
      tmdbId: typeId
    }

    const response: ApiResponse<any> = await service.createFavorite(authStore.getUserId, favorite)

    if (!response.success) {
      return
    }

    useNotifications().success(
      t('common.toasts.title.success'),
      t(`common.favorite.toasts.success.${type}.addedToList`)
    )
  }

  return {
    addFavorite,
    isFavorite
  }
}
