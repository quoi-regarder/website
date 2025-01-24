export interface Profile {
  userId: string
  username: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  language: languageIsoType
  colorMode: ColorModeType
  createdAt: Date | null
  updatedAt: Date | null
  user: Partial<User>
}
