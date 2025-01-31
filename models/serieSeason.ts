export interface SerieSeason {
  seasonId: number
  serieId: number
  seasonNumber: number
  airDate: string
  episodeCount: number
  createdAt: string
  updatedAt: string
  serie: Partial<Serie>
  episodes: Partial<SerieEpisode>[]
}
