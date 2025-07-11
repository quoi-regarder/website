export interface ViewingDetails {
  id: number
  platformId: number
  rating: number
  emotion: Emotion
  contextType: ContextType
  contextId: number
  userId: string | null
}
