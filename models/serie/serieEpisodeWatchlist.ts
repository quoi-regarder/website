export interface SerieEpisodeWatchlist {
  tmdbId: number
  userId: string
  status: WatchStatus
  createdAt: string
  updatedAt: string
  seasonNumber?: number
  profile?: Partial<Profile>
  episode?: Partial<SerieEpisode>
}
