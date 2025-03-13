export const useAuthService = () => {
  const { t } = useI18n()

  const register = async (credentials: Partial<User>): Promise<ApiResponse> => {
    const response: ApiResponse = await apiFetch('/auth/register', {
      method: 'POST',
      body: credentials
    })

    if (response.exception) {
      switch (response.exception) {
        case Exception.USER_ALREADY_EXISTS:
          useNotifications().error(
            t('common.toasts.title.error'),
            t(`common.toasts.errors.${response.error}.${response.errors.field}`)
          )
          break
        default:
          console.error('Error during signup.')
          break
      }
    }

    return response
  }

  const login = async (credentials: Partial<User>): Promise<ApiResponse> => {
    const response: ApiResponse = await apiFetch('/auth/login', {
      method: 'POST',
      body: credentials
    })

    if (response.exception) {
      switch (response?.exception) {
        case Exception.EMAIL_NOT_VERIFIED:
          useNotifications().error(
            t('common.toasts.title.error'),
            t(`common.toasts.errors.${response.error}`)
          )
          break
        case Exception.BAD_CREDENTIALS:
          if (response.errors.attemptsLeft === 0) {
            useNotifications().error(
              t('common.toasts.title.error'),
              t('common.toasts.errors.timeout', { count: response.errors.timeout })
            )
          } else {
            useNotifications().error(
              t('common.toasts.title.error'),
              t(`common.toasts.errors.${response.error}`, { count: response.errors.attemptsLeft })
            )
          }
          break
        default:
          console.error('Error during login.')
          break
      }
    }

    return response
  }

  const socialLogin = async (provider: 'google'): Promise<string> => {
    const response: ApiResponse = await apiFetch(`/social/${provider}`)

    return response.redirectUrl
  }

  const socialCallback = async (provider: 'google', code: string | null): Promise<ApiResponse> => {
    if (!code) {
      useNotifications().error(
        t('common.toasts.title.error'),
        t('google.toasts.error.invalidToken')
      )
    }

    const response: ApiResponse = await apiFetch(`/social/${provider}/callback?code=${code}`)

    if (response.exception) {
      switch (response?.exception) {
        case Exception.OAUTH_AUTHENTICATION_FAILED:
          useNotifications().error(
            t('common.toasts.title.error'),
            t(`common.toasts.errors.${response.error}`)
          )
          break
        case Exception.OAUTH_SERVICE_UNAVAILABLE:
          useNotifications().error(
            t('common.toasts.title.error'),
            t(`google.toasts.error.${response.error}`)
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
    await apiFetch('/auth/logout', { method: 'POST' })
  }

  const forgotPassword = async (email: string | undefined): Promise<ApiResponse> => {
    const response: ApiResponse = await apiFetch('/reset-password/send', {
      method: 'POST',
      body: { email }
    })

    if (response.exception) {
      switch (response?.exception) {
        case Exception.ENTITY_NOT_EXISTS:
          // We don't want to expose the fact that the email doesn't exist
          break
        default:
          console.error('Error during forgot password.')
          break
      }
    }

    return response
  }

  const resetPassword = async (password: string, token: string): Promise<ApiResponse> => {
    const response: ApiResponse = await apiFetch('/reset-password/store', {
      method: 'POST',
      body: { password, token }
    })

    if (response.exception) {
      switch (response?.exception) {
        case Exception.INVALID_TOKEN:
          useNotifications().error(
            t('common.toasts.title.error'),
            t(`common.toasts.errors.${response.error}.reset`)
          )
          break
        default:
          console.error('Error during reset password.')
          break
      }
    }

    return response
  }

  const verifyEmail = async (token: string): Promise<ApiResponse> => {
    const response: ApiResponse = await apiFetch(`/verify-email/${token}`)

    if (response.exception) {
      switch (response?.exception) {
        case Exception.INVALID_TOKEN:
          useNotifications().error(
            t('common.toasts.title.error'),
            t(`common.toasts.errors.${response.error}.verify`)
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
