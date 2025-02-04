export const useSerieWatchlistService = (): WatchlistService => {
  const getWatchlist = async (userId: string | null): Promise<ApiResponse> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(`/serie-watchlist/${userId}/serie`)

    if (response.errors || response.errorStatus) {
      console.error('Failed to fetch serie watchlist.')
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
      `/serie-watchlist/${userId}/serie/details?status=${status}&page=${page}&limit=${limit}`
    )

    if (response.errors || response.errorStatus) {
      console.error('Failed to fetch serie watchlist.')
    }

    return response
  }

  const createWatchlist = async (
    userId: string | null,
    data: SerieWatchlist
  ): Promise<ApiResponse> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(`/serie-watchlist/${userId}/serie`, {
      method: 'POST',
      body: data
    })

    if (response.errors || response.errorStatus) {
      console.error('Failed to create serie watchlist.')
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

    const response: ApiResponse = await apiFetch(`/serie-watchlist/${userId}/serie/${tmdbId}`, {
      method: 'PUT',
      body: { status }
    })

    if (response.errors || response.errorStatus) {
      console.error('Failed to update serie watchlist.')
    }

    return response
  }

  const removeWatchlist = async (userId: string | null, tmdbId: string | number): Promise<any> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(`/serie-watchlist/${userId}/serie/${tmdbId}`, {
      method: 'DELETE'
    })

    if (response.errors || response.errorStatus) {
      console.error('Failed to remove serie watchlist.')
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
