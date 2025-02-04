export const useAuthService = () => {
  const { t } = useI18n()

  const register = async (credentials: Partial<User>): Promise<ApiResponse> => {
    const response: ApiResponse = await apiFetch('/auth/register', {
      method: 'POST',
      body: credentials
    })

    response.errors?.forEach((error: ApiError) => {
      if (error.rule === 'email') {
        useNotifications().error(
          t('common.toasts.title.error'),
          t(`common.toasts.errors.${error.rule}.${error.field}`)
        )
      } else if (error.rule.includes('unique')) {
        useNotifications().error(
          t('common.toasts.title.error'),
          t(`common.toasts.errors.${error.rule}.${error.field}`)
        )
      } else {
        console.error('Error during signup.')
      }
    })

    return response
  }

  const login = async (credentials: Partial<User>): Promise<ApiResponse> => {
    const response: ApiResponse = await apiFetch('/auth/login', {
      method: 'POST',
      body: credentials
    })

    if (response.errorStatus && response.errorStatus !== ErrorStatus.VALIDATION_FAILED) {
      useNotifications().error(
        t('common.toasts.title.error'),
        t(`common.toasts.errors.${response.errorStatus}`)
      )
    }

    response.errors?.forEach((error: ApiError) => {
      if (error.rule === 'email') {
        useNotifications().error(
          t('common.toasts.title.error'),
          t(`common.toasts.errors.${error.rule}.${error.field}`)
        )
      } else {
        console.error('Error during login.')
      }
    })

    return response
  }

  const socialLogin = async (provider: 'google'): Promise<string> => {
    const response: ApiResponse = await apiFetch(`/social/${provider}`)

    return response.data.redirectUrl
  }

  const socialCallback = async (provider: 'google', code: string | null): Promise<ApiResponse> => {
    if (!code) {
      useNotifications().error(
        t('common.toasts.title.error'),
        t('google.toasts.error.invalidToken')
      )
    }

    const response: ApiResponse = await apiFetch(`/social/callback/${provider}?code=${code}`)

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

    response.errors?.forEach((error: ApiError) => {
      if (error.rule === 'email') {
        useNotifications().error(
          t('common.toasts.title.error'),
          t(`common.toasts.errors.${error.rule}.${error.field}`)
        )
      } else {
        console.error('Error during forgot password.')
      }
    })

    return response
  }

  const resetPassword = async (password: string, token: string): Promise<ApiResponse> => {
    const response: ApiResponse = await apiFetch('/reset-password/store', {
      method: 'POST',
      body: { password, token }
    })

    if (response.errorStatus && response.errorStatus !== ErrorStatus.VALIDATION_FAILED) {
      useNotifications().error(
        t('common.toasts.title.error'),
        t(`common.toasts.errors.${response.errorStatus}`)
      )
    }

    response.errors?.forEach((error: ApiError) => {
      if (error.rule === 'password') {
        useNotifications().error(
          t('common.toasts.title.error'),
          t(`common.toasts.errors.${error.rule}.${error.field}`)
        )
      } else {
        console.error('Error during reset password.')
      }
    })

    return response
  }

  const verifyEmail = async (token: string): Promise<ApiResponse> => {
    const response: ApiResponse = await apiFetch(`/verify-email/${token}`)

    if (response.errorStatus) {
      useNotifications().error(
        t('common.toasts.title.error'),
        t(`common.toasts.errors.${response.errorStatus}`)
      )
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
