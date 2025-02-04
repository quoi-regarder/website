export const useMovieWatchlistService = (): WatchlistService => {
  const getWatchlist = async (userId: string | null): Promise<ApiResponse> => {
    if (!userId) {
      throw new Error('User ID is required')
    }
    const response: ApiResponse = await apiFetch(`/movie-watchlist/${userId}/movie`)

    if (response.errors || response.errorStatus) {
      console.error('Failed to fetch movie watchlist.')
    }

    return response
  }

  const getWatchlistWithDetails = async (
    userId: string | null,
    status: WatchStatus,
    page: number,
    limit: number = 10
  ): Promise<ApiResponse> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(
      `/movie-watchlist/${userId}/movie/details?status=${status}&page=${page}&limit=${limit}`
    )

    if (response.errors || response.errorStatus) {
      console.error('Failed to fetch movie watchlist.')
    }

    return response
  }

  const createWatchlist = async (
    userId: string | null,
    data: MovieWatchlist
  ): Promise<ApiResponse> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(`/movie-watchlist/${userId}/movie`, {
      method: 'POST',
      body: data
    })

    if (response.errors || response.errorStatus) {
      console.error('Failed to create movie watchlist.')
    }

    return response
  }

  const updateWatchlist = async (
    userId: string | null,
    tmdbId: string | number | null,
    status: WatchStatus
  ): Promise<ApiResponse> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(`/movie-watchlist/${userId}/movie/${tmdbId}`, {
      method: 'PUT',
      body: { status }
    })

    if (response.errors || response.errorStatus) {
      console.error('Failed to update movie watchlist.')
    }

    return response
  }

  const removeWatchlist = async (
    userId: string | null,
    tmdbId: number | string
  ): Promise<ApiResponse> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(`/movie-watchlist/${userId}/movie/${tmdbId}`, {
      method: 'DELETE'
    })

    if (response.errors || response.errorStatus) {
      console.error('Failed to remove movie watchlist.')
    }

    return response
  }

  return {
    getWatchlist,
    getWatchlistWithDetails,
    createWatchlist,
    updateWatchlist,
    removeWatchlist
  }
}
