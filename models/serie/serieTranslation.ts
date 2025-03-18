export interface SerieTranslation {
  tmdbId: number
  languge: languageIsoType
  name: string
  overview: string
  createdAt: string
  updatedAt: string
  serie: Partial<Serie>
}
