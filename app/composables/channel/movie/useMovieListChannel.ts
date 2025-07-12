export const useMovieListChannel = () => {
  return useEntityChannel(
    createWatchlistChannelConfig(
      useMovieWatchlistService,
      useMovieListStore,
      SseEventType.MOVIE_WATCHLIST_IDS_UPDATE,
      'watchlist'
    )
  )
}
