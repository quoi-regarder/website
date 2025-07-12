export const useSerieListChannel = () => {
  return useEntityChannel(
    createWatchlistChannelConfig(
      useSerieWatchlistService,
      useSerieListStore,
      SseEventType.SERIE_WATCHLIST_IDS_UPDATE,
      'watchlist'
    )
  )
}
