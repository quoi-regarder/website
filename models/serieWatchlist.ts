export interface SerieWatchlist {
  tmdbId: number
  userId: string
  status: WatchStatus
  createdAt: string
  updatedAt: string
  serie?: Partial<Serie>
}
