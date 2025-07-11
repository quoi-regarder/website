export const useAuthService = () => {
  const { t } = useI18n()

  const register = async (
    credentials: Partial<User & Partial<Profile>>
  ): Promise<ApiResponse<User>> => {
    const response: ApiResponse<User> = await apiFetch('/auth/register', {
      method: 'POST',
      body: credentials
    })

    if (!response.success) {
      switch (response.error?.status) {
        case ErrorStatus.USER_ALREADY_EXISTS:
          useNotifications().error(
            t('common.toasts.title.error'),
            t(`common.toasts.errors.user.already.exists.${response.error.errors?.field}`)
          )
          break
        default:
          console.error('Error during signup.')
          break
      }
    }

    return response
  }

  const login = async (credentials: Partial<User>): Promise<ApiResponse<LoginResponse>> => {
    const response: ApiResponse<LoginResponse> = await apiFetch('/auth/login', {
      method: 'POST',
      body: credentials
    })

    if (!response.success) {
      switch (response.error?.status) {
        case ErrorStatus.BAD_CREDENTIALS:
          if (response.error.errors?.attemptsLeft === 0) {
            useNotifications().error(
              t('common.toasts.title.error'),
              t('common.toasts.errors.timeout', { count: response.error.errors.timeout })
            )
          } else {
            useNotifications().error(
              t('common.toasts.title.error'),
              t('common.toasts.errors.bad.credentials', {
                count: response.error.errors?.attemptsLeft
              })
            )
          }
          break
        case ErrorStatus.EMAIL_NOT_VERIFIED:
          useNotifications().error(
            t('common.toasts.title.error'),
            t('common.toasts.errors.email.not.verified')
          )
          break
        default:
          console.error('Error during login.')
          break
      }
    }

    return response
  }

  const socialLogin = async (provider: 'google'): Promise<string> => {
    const response: ApiResponse<OAuthResponse> = await apiFetch(`/social/${provider}`)

    if (!response.success) {
      switch (response.error?.status) {
        default:
          console.error('Error during social login.')
          break
      }
    }

    return response.data!.redirectUrl
  }

  const socialCallback = async (
    provider: 'google',
    code: string | null
  ): Promise<ApiResponse<LoginResponse>> => {
    if (!code) {
      useNotifications().error(
        t('common.toasts.title.error'),
        t('google.toasts.error.invalidToken')
      )
    }

    const response: ApiResponse<LoginResponse> = await apiFetch(
      `/social/${provider}/callback?code=${code}`
    )

    if (!response.success) {
      switch (response.error?.status) {
        case ErrorStatus.OAUTH_AUTHENTICATION_FAILED:
          useNotifications().error(
            t('common.toasts.title.error'),
            t('common.toasts.errors.oauth.authentication.failed')
          )
          break
        case ErrorStatus.SERVICE_UNAVAILABLE:
          useNotifications().error(
            t('common.toasts.title.error'),
            t('google.toasts.error.service.unavailable')
          )
          break
        default:
          console.error('Error during social login.')
          break
      }
    }

    return response
  }

  const logout = async (): Promise<void> => {
    const response: ApiResponse<void> = await apiFetch('/auth/logout', { method: 'POST' })

    if (!response.success) {
      console.error('Error during logout.')
    }

    return
  }

  const forgotPassword = async (email: string | undefined): Promise<ApiResponse<void>> => {
    const response: ApiResponse<void> = await apiFetch('/reset-password/send', {
      method: 'POST',
      body: { email }
    })

    if (!response.success) {
      switch (response.error?.status) {
        case ErrorStatus.RESSOURCE_NOT_FOUND:
          // We don't want to expose the fact that the email doesn't exist
          break
        default:
          console.error('Error during forgot password.')
          break
      }
    }

    return response
  }

  const resetPassword = async (
    password: string,
    token: string
  ): Promise<ApiResponse<LoginResponse>> => {
    const response: ApiResponse<LoginResponse> = await apiFetch('/reset-password/store', {
      method: 'POST',
      body: { password, token }
    })

    if (!response.success) {
      switch (response.error?.status) {
        case ErrorStatus.INVALID_TOKEN:
          useNotifications().error(
            t('common.toasts.title.error'),
            t('common.toasts.errors.invalid.token.reset')
          )
          break
        default:
          console.error('Error during reset password.')
          break
      }
    }

    return response
  }

  const verifyEmail = async (token: string): Promise<ApiResponse<void>> => {
    const response: ApiResponse<void> = await apiFetch(`/verify-email/${token}`)

    if (!response.success) {
      switch (response.error?.status) {
        case ErrorStatus.INVALID_TOKEN:
          useNotifications().error(
            t('common.toasts.title.error'),
            t('common.toasts.errors.invalid.token.verify')
          )
          break
        default:
          console.error('Error during email verification.')
          break
      }
    }

    return response
  }

  return {
    register,
    login,
    socialLogin,
    socialCallback,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail
  }
}
