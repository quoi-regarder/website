export enum Exception {
  JWT_HAS_EXPIRED = 'JWT has expired',
  RATE_LIMIT_EXCEEDED = 'Rate limit exceeded',
  VALIDATION_FAILED = 'Validation failed',
  AUTHENTICATION_FAILED = 'Authentication failed',
  EMAIL_NOT_VERIFIED = 'Email not verified',
  USER_ALREADY_EXISTS = 'User already exists',
  INVALID_TOKEN = 'Invalid token',
  ENTITY_NOT_EXISTS = 'Entity not exists',
  BAD_CREDENTIALS = 'Bad credentials',
  OAUTH_AUTHENTICATION_FAILED = 'OAuth authentication failed',
  OAUTH_SERVICE_UNAVAILABLE = 'OAuth service unavailable'
}
