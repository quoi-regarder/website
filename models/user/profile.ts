export interface Profile {
  userId: string
  email: string
  username: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  language: languageIsoType
  colorMode: ColorModeType
  onboarding: boolean
  createdAt: Date | null
  updatedAt: Date | null
}
