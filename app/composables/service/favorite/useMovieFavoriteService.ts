export const useMovieFavoriteService = () =>
  createFavoriteService<MovieFavorite, MovieFavoriteIds>({
    endpoint: 'movie-favorite',
    entityType: 'movie'
  })
