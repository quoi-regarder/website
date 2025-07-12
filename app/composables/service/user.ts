export const useUserService = () => {
  const { t } = useI18n()

  const deleteUser = async (id: string | null): Promise<void> => {
    if (!id) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(`/users/${id}`, {
      method: 'DELETE'
    })

    if (response.errors || response.errorStatus) {
      console.error('Failed to delete user.')
      useNotifications().error(
        t('common.toasts.title.error'),
        t(`common.api.error.${response.errorStatus}`)
      )
    }
  }

  return {
    deleteUser
  }
}
