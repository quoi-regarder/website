export const useSeasonWatchlistService = (): WatchlistService => {
  const getWatchlist = async (
    userId: string | null,
    tmdbId: string | number | null
  ): Promise<ApiResponse<SerieSeasonIds>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<SerieSeasonIds> = await apiFetch(
      `/serie-watchlist/${userId}/serie/${tmdbId}/season`
    )
    if (!response.success) {
      console.error('Failed to fetch season watchlist.')
    }

    return response
  }

  const createWatchlist = async (
    userId: string | null,
    data: SerieSeasonWatchlist,
    contentId?: number | null
  ): Promise<ApiResponse<SerieSeasonWatchlist>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<SerieSeasonWatchlist> = await apiFetch(
      `/serie-watchlist/${userId}/serie/${contentId}/season`,
      {
        method: 'POST',
        body: data
      }
    )

    if (!response.success) {
      console.error('Failed to create season watchlist.')
    }

    return response
  }

  const updateWatchlist = async (
    userId: string | null,
    tmdbId: string | number | null,
    status: WatchStatus,
    contentId?: number | null
  ): Promise<ApiResponse<SerieSeasonWatchlist>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<SerieSeasonWatchlist> = await apiFetch(
      `/serie-watchlist/${userId}/serie/${contentId}/season/${tmdbId}`,
      {
        method: 'PUT',
        body: { status }
      }
    )

    if (!response.success) {
      console.error('Failed to update season watchlist.')
    }

    return response
  }

  const removeWatchlist = async (
    userId: string | null,
    tmdbId: string | number | null,
    contentId?: number | null
  ): Promise<ApiResponse<void>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<void> = await apiFetch(
      `/serie-watchlist/${userId}/serie/${contentId}/season/${tmdbId}`,
      {
        method: 'DELETE'
      }
    )

    if (response.errors || response.errorStatus) {
      console.error('Failed to remove season watchlist.')
    }

    return response
  }

  return {
    getWatchlist,
    createWatchlist,
    updateWatchlist,
    removeWatchlist
  }
}
