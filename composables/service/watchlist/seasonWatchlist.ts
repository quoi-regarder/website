export const useSeasonWatchlistService = (): WatchlistService => {
  const getWatchlist = async (
    userId: string | null,
    tmdbId: string | number | null
  ): Promise<SerieSeasonWatchlist> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(
      `/serie-watchlist/${userId}/serie/${tmdbId}/season`
    )
    if (response.errors || response.errorStatus) {
      console.error('Failed to fetch season watchlist:', response.errors, response.errorStatus)
    }

    return response.data
  }

  const createWatchlist = async (
    userId: string | null,
    data: SerieSeasonWatchlist,
    contentId?: number | null
  ): Promise<SerieSeasonWatchlist> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(
      `/serie-watchlist/${userId}/serie/${contentId}/season`,
      {
        method: 'POST',
        body: data
      }
    )

    return response.data?.seasonWatchlist
  }

  const updateWatchlist = async (
    userId: string | null,
    tmdbId: string | number | null,
    status: WatchStatus,
    contentId?: number | null
  ): Promise<SerieSeasonWatchlist> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(
      `/serie-watchlist/${userId}/serie/${contentId}/season/${tmdbId}`,
      {
        method: 'PUT',
        body: { status }
      }
    )

    return response.data?.seasonWatchlist
  }

  const removeWatchlist = async (
    userId: string | null,
    tmdbId: string | number | null,
    contentId?: number | null
  ): Promise<any> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    await apiFetch(`/serie-watchlist/${userId}/serie/${contentId}/season/${tmdbId}`, {
      method: 'DELETE'
    })
  }

  return {
    getWatchlist,
    createWatchlist,
    updateWatchlist,
    removeWatchlist
  }
}
