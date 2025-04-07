export const useSerieWatchlistService = (): WatchlistService => {
  const getWatchlist = async (userId: string | null): Promise<ApiResponse<SerieIds>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<SerieIds> = await apiFetch(`/serie-watchlist/${userId}/serie`)

    if (!response.success) {
      console.error('Failed to fetch serie watchlist.')
    }

    return response
  }

  const getWatchlistWithDetails = async (
    userId: string | null,
    status: WatchStatus,
    page: number,
    limit: number = 20
  ): Promise<ApiResponse<Pagination<Serie>>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<Pagination<Serie>> = await apiFetch(
      `/serie-watchlist/${userId}/serie/details?status=${status}&page=${page}&limit=${limit}`
    )

    if (!response.success) {
      console.error('Failed to fetch serie watchlist.')
    }

    return response
  }

  const createWatchlist = async (
    userId: string | null,
    data: SerieWatchlist
  ): Promise<ApiResponse<SerieWatchlist>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<SerieWatchlist> = await apiFetch(
      `/serie-watchlist/${userId}/serie`,
      {
        method: 'POST',
        body: data
      }
    )

    if (!response.success) {
      console.error('Failed to create serie watchlist.')
    }

    return response
  }

  const updateWatchlist = async (
    userId: string | null,
    tmdbId: string | number | null,
    status: WatchStatus
  ): Promise<ApiResponse<SerieWatchlist>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<SerieWatchlist> = await apiFetch(
      `/serie-watchlist/${userId}/serie/${tmdbId}`,
      {
        method: 'PUT',
        body: { status }
      }
    )

    if (!response.success) {
      console.error('Failed to update serie watchlist.')
    }

    return response
  }

  const removeWatchlist = async (
    userId: string | null,
    tmdbId: string | number
  ): Promise<ApiResponse<void>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<void> = await apiFetch(
      `/serie-watchlist/${userId}/serie/${tmdbId}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.success) {
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
