export interface ErrorMeta {
  status: ErrorStatus
  details?: any
  errors?: Record<string, any>
}
