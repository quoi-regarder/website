export const useEpisodeWatchlistService = (): WatchlistService => {
  const getWatchlist = async (
    userId: string | null,
    tmdbId: string | number | null
  ): Promise<ApiResponse<SerieEpisodeIds>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<SerieEpisodeIds> = await apiFetch(
      `/serie-watchlist/${userId}/serie/${tmdbId}/episode`
    )
    if (!response.success) {
      console.error('Failed to fetch season watchlist.')
    }

    return response
  }

  const createWatchlist = async (
    userId: string | null,
    data: SerieEpisodeWatchlist,
    contentId?: number | null
  ): Promise<ApiResponse<SerieEpisodeWatchlist>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<SerieEpisodeWatchlist> = await apiFetch(
      `/serie-watchlist/${userId}/serie/${contentId}/episode`,
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
  ): Promise<ApiResponse<SerieEpisodeWatchlist>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<SerieEpisodeWatchlist> = await apiFetch(
      `/serie-watchlist/${userId}/serie/${contentId}/episode/${tmdbId}`,
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
      `/serie-watchlist/${userId}/serie/${contentId}/episode/${tmdbId}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.success) {
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
