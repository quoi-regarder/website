export const useSerieFavoriteChannel = () => {
  return useEntityChannel(
    createFavoriteChannelConfig(
      useSerieFavoriteService,
      useSerieFavoriteStore,
      SseEventType.SERIE_FAVORITE_IDS_UPDATE,
      'favorite'
    )
  )
}
