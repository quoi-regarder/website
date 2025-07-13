export const useMovieWatchlistService = () =>
  createWatchlistService<MovieWatchlist, MovieWatchlistIds>({
    endpoint: 'movie-watchlist',
    entityType: 'movie'
  })
