export const useSerieFavoriteService = (): FavoriteService => {
  const getFavorite = async (userId: string | null): Promise<ApiResponse<SerieFavoriteIds>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<SerieFavoriteIds> = await apiFetch(
      `/serie-favorite/${userId}/serie`
    )

    if (!response.success) {
      console.error('Failed to fetch serie favorite.')
    }

    return response
  }

  const getFavoriteWithDetails = async (
    userId: string | null,
    page: number,
    limit: number = 20
  ): Promise<ApiResponse<Pagination<Serie>>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<Pagination<Serie>> = await apiFetch(
      `/serie-favorite/${userId}/serie/details?page=${page}&limit=${limit}`
    )

    if (!response.success) {
      console.error('Failed to fetch serie favorite with details.')
    }

    return response
  }

  const createFavorite = async (
    userId: string | null,
    data: SerieFavorite
  ): Promise<ApiResponse<SerieFavorite>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<SerieFavorite> = await apiFetch(`/serie-favorite/${userId}/serie`, {
      method: 'POST',
      body: data
    })

    if (!response.success) {
      console.error('Error during serie favorite creation.')
    }

    return response
  }

  const removeFavorite = async (
    userId: string | null,
    tmdbId: number
  ): Promise<ApiResponse<SerieFavorite>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<SerieFavorite> = await apiFetch(
      `/serie-favorite/${userId}/serie/${tmdbId}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.success) {
      console.error('Error during serie favorite deletion.')
    }

    return response
  }

  return {
    getFavorite,
    getFavoriteWithDetails,
    createFavorite,
    removeFavorite
  }
}
