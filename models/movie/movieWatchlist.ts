export interface MovieWatchlist {
  tmdbId: number
  userId: string
  status: WatchStatus
  createdAt: string
  updatedAt: string
  user?: Partial<User>
  movie?: Partial<Movie>
}
