export const useProfileService = () => {
  const { t } = useI18n()

  const getProfile = async (id: string | null): Promise<Profile | null> => {
    if (!id) {
      throw new Error('Profile ID is required')
    }

    const response: ApiResponse<Profile> = await apiFetch(`/profiles/${id}`)

    if (!response.success) {
      console.error('Error during profile fetch.')
      return null
    }

    return response.data
  }

  const updateProfile = async (
    id: string | null,
    data: Partial<Profile>
  ): Promise<Profile | null> => {
    if (!id) {
      throw new Error('Profile ID is required')
    }

    const response: ApiResponse<Profile> = await apiFetch(`/profiles/${id}`, {
      method: 'PUT',
      body: data
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
          console.error('Error during update profile.')
          break
      }
      return null
    }

    return response.data
  }

  const updateAvatar = async (id: string | null, avatar: File): Promise<Profile | null> => {
    if (!id) {
      throw new Error('Profile ID is required')
    }

    const formData = new FormData()
    formData.append('avatar', avatar)

    const response: ApiResponse<Profile> = await apiFetch(`/profiles/${id}/avatar`, {
      method: 'PUT',
      contentType: 'multipart/form-data',
      body: formData
    })

    if (!response.success) {
      console.error('Error during avatar update.')
      return null
    }

    return response.data
  }

  const deleteAvatar = async (id: string | null): Promise<Profile | null> => {
    if (!id) {
      throw new Error('Profile ID is required')
    }

    const response: ApiResponse<Profile> = await apiFetch(`/profiles/${id}/avatar`, {
      method: 'DELETE'
    })

    if (!response.success) {
      console.error('Error during avatar delete.')
      return null
    }

    return response.data
  }

  const updateLanguage = async (
    id: string | null,
    language: languageIsoType
  ): Promise<Profile | null> => {
    if (!id) {
      throw new Error('Profile ID is required')
    }

    const response: ApiResponse<Profile> = await apiFetch(`/profiles/${id}/language`, {
      method: 'PUT',
      body: { language }
    })

    if (!response.success) {
      switch (response.error?.status) {
        case ErrorStatus.INVALID_LANGUAGE:
          useNotifications().error(
            t('common.toasts.title.error'),
            t('common.toasts.errors.invalid.language')
          )
          break
        default:
          console.error('Error during language update.')
          break
      }
      return null
    }

    return response.data
  }

  const updateColorMode = async (
    id: string | null,
    colorMode: ColorModeType
  ): Promise<Profile | null> => {
    if (!id) {
      throw new Error('Profile ID is required')
    }

    const response: ApiResponse<Profile> = await apiFetch(`/profiles/${id}/color-mode`, {
      method: 'PUT',
      body: {
        colorMode
      }
    })

    if (!response.success) {
      console.error('Error during color mode update.')
      return null
    }

    return response.data
  }

  return {
    getProfile,
    updateProfile,
    deleteAvatar,
    updateAvatar,
    updateLanguage,
    updateColorMode
  }
}
