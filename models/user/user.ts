export interface User {
  id: string
  roleId: number
  email: string
  password: string | null
  isEmailVerified: boolean
  socialProvider: string | null
  createdAt: Date | null
  updatedAt: Date | null
}
