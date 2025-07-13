export const useSerieWatchlistService = () =>
  createWatchlistService<SerieWatchlist, SerieIds>({
    endpoint: 'serie-watchlist',
    entityType: 'serie'
  })
