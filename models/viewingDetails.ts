export interface ViewingDetails {
  id: number
  platformId: number
  rating: number
  liked: boolean
  emotion: Emotion
  contextType: ContextType
  contextId: number
  userId: string | null
}
