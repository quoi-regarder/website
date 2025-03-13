export interface ApiResponse {
  error: string
  errors: any
  exception?: Exception
  status: number
  timestamp: string
  message: string
}
