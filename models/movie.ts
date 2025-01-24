export interface Movie {
  tmdbId: number
  runtime: number
  releaseDate: string
  posterPath: string
  createdAt: string
  updatedAt: string
  translations: MovieTranslation[]
  movieWatchlist: MovieWatchlist[]
}
