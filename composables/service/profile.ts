export const useProfileService = () => {
  const { t } = useI18n()

  const getProfile = async (id: string | null): Promise<Profile | null> => {
    if (!id) {
      throw new Error('Profile ID is required')
    }

    const response: ApiResponse = await apiFetch(`/profiles/${id}`)

    if (response.errors || response.errorStatus) {
      return null
    }
    return response.data?.profile
  }

  const updateProfile = async (id: string | null, data: Partial<Profile>): Promise<Profile> => {
    if (!id) {
      throw new Error('Profile ID is required')
    }

    const response: ApiResponse = await apiFetch(`/profiles/${id}`, {
      method: 'PUT',
      body: data
    })

    response.errors?.forEach((error: ApiError) => {
      if (error.rule.includes('unique')) {
        useNotifications().error(
          t('common.toasts.title.error'),
          t(`common.toasts.errors.${error.rule}.${error.field}`)
        )
      } else {
        console.error('Error during signup.')
      }
    })

    return response.data?.profile
  }

  const updateAvatar = async (id: string | null, avatar: File): Promise<Profile> => {
    if (!id) {
      throw new Error('Profile ID is required')
    }

    const formData = new FormData()
    formData.append('avatar', avatar)

    const response: ApiResponse = await apiFetch(`/profiles/${id}/avatar`, {
      method: 'PUT',
      ...(avatar instanceof File && {
        contentType: 'multipart/form-data',
        body: formData
      })
    })

    if (response.errors || response.errorStatus) {
      console.error('Failed to update profile avatar.')
    }

    return response.data?.profile
  }

  const updateLanguage = async (id: string | null, language: languageIsoType): Promise<Profile> => {
    if (!id) {
      throw new Error('Profile ID is required')
    }

    const response: ApiResponse = await apiFetch(`/profiles/${id}/language`, {
      method: 'PUT',
      body: { language }
    })

    return response.data?.profile
  }

  const updateColorMode = async (id: string | null, colorMode: ColorModeType): Promise<Profile> => {
    if (!id) {
      throw new Error('Profile ID is required')
    }

    const response: ApiResponse = await apiFetch(`/profiles/${id}/color-mode`, {
      method: 'PUT',
      body: { colorMode }
    })

    return response.data?.profile
  }

  return {
    getProfile,
    updateProfile,
    updateAvatar,
    updateLanguage,
    updateColorMode
  }
}
