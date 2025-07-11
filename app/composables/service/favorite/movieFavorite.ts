export const useMovieFavoriteService = (): FavoriteService => {
  const getFavorite = async (userId: string | null): Promise<ApiResponse<MovieFavoriteIds>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<MovieFavoriteIds> = await apiFetch(
      `/movie-favorite/${userId}/movie`
    )

    if (!response.success) {
      console.error('Failed to fetch movie favorite.')
    }

    return response
  }

  const getFavoriteWithDetails = async (
    userId: string | null,
    page: number,
    limit: number = 20
  ): Promise<ApiResponse<Pagination<Movie>>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<Pagination<Movie>> = await apiFetch(
      `/movie-favorite/${userId}/movie/details?page=${page}&limit=${limit}`
    )

    if (!response.success) {
      console.error('Failed to fetch movie favorite with details.')
    }

    return response
  }

  const createFavorite = async (
    userId: string | null,
    data: MovieFavorite
  ): Promise<ApiResponse<MovieFavorite>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<MovieFavorite> = await apiFetch(`/movie-favorite/${userId}/movie`, {
      method: 'POST',
      body: data
    })

    if (!response.success) {
      console.error('Error during movie favorite creation.')
    }

    return response
  }

  const removeFavorite = async (
    userId: string | null,
    tmdbId: number
  ): Promise<ApiResponse<MovieFavorite>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<MovieFavorite> = await apiFetch(
      `/movie-favorite/${userId}/movie/${tmdbId}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.success) {
      console.error('Error during movie favorite deletion.')
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
