export interface AuthAccessToken {
  abilities: string[]
  expiresAt: string
  lastUsedAt: string | null
  name: string | null
  token: string
  type: string
}
