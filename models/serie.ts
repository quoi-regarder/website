export interface Serie {
  tmdbId: number
  firstAirDate: string
  posterPath: string
  createdAt: string
  updatedAt: string
  translations: SerieTranslation[]
  serieWatchlist: SerieWatchlist[]
}
