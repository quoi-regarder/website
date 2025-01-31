export const useSerieWatchlistService = (): WatchlistService => {
  const getWatchlist = async (userId: string | null): Promise<SerieWatchlist> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(`/serie-watchlist/${userId}/serie`)

    if (response.errors || response.errorStatus) {
      console.error('Failed to fetch serie watchlist:', response.errors, response.errorStatus)
    }

    return response.data
  }

  const getWatchlistWithDetails = async (
    userId: string | null,
    status: WatchStatus,
    page: number,
    limit: number = 10
  ): Promise<any> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(
      `/serie-watchlist/${userId}/serie/details?status=${status}&page=${page}&limit=${limit}`
    )

    if (response.errors || response.errorStatus) {
      console.error('Failed to fetch serie watchlist:', response.errors, response.errorStatus)
    }

    return response.data
  }

  const createWatchlist = async (
    userId: string | null,
    data: SerieWatchlist
  ): Promise<SerieWatchlist> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(`/serie-watchlist/${userId}/serie`, {
      method: 'POST',
      body: data
    })

    return response.data?.serieWatchlist
  }

  const updateWatchlist = async (
    userId: string | null,
    tmdbId: string | number | null,
    status: WatchStatus
  ): Promise<SerieWatchlist> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(`/serie-watchlist/${userId}/serie/${tmdbId}`, {
      method: 'PUT',
      body: { status }
    })

    return response.data?.serieWatchlist
  }

  const removeWatchlist = async (userId: string | null, tmdbId: string | number): Promise<any> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    await apiFetch(`/serie-watchlist/${userId}/serie/${tmdbId}`, {
      method: 'DELETE'
    })
  }

  return {
    getWatchlist,
    getWatchlistWithDetails,
    createWatchlist,
    updateWatchlist,
    removeWatchlist
  }
}
