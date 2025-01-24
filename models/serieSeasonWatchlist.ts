export interface SerieSeasonWatchlist {
  tmdbId: number
  userId: string
  status: WatchStatus
  createdAt: string
  updatedAt: string
  user?: Partial<Profile>
  season?: Partial<SerieSeason>
}
