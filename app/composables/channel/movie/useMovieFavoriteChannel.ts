export const useMovieFavoriteChannel = () => {
  return useEntityChannel(
    createFavoriteChannelConfig(
      useMovieFavoriteService,
      useMovieFavoriteStore,
      SseEventType.MOVIE_FAVORITE_IDS_UPDATE,
      'favorite'
    )
  )
}
