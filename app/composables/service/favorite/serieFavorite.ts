export const useSerieFavoriteService = () =>
  createFavoriteService<SerieFavorite, SerieFavoriteIds>({
    endpoint: 'serie-favorite',
    entityType: 'serie'
  })
