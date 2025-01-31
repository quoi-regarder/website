export const useEpisodeWatchlistService = (): WatchlistService => {
  const getWatchlist = async (
    userId: string | null,
    tmdbId: string | number | null,
    seasonNumber: number | null
  ): Promise<SerieEpisodeWatchlist> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(
      `/serie-watchlist/${userId}/serie/${tmdbId}/episode/${seasonNumber}`
    )
    if (response.errors || response.errorStatus) {
      console.error('Failed to fetch season watchlist:', response.errors, response.errorStatus)
    }

    return response.data
  }

  const createWatchlist = async (
    userId: string | null,
    data: SerieEpisodeWatchlist,
    contentId?: number | null
  ): Promise<SerieEpisodeWatchlist> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(
      `/serie-watchlist/${userId}/serie/${contentId}/episode`,
      {
        method: 'POST',
        body: data
      }
    )

    return response.data?.episodeWatchlist
  }

  const updateWatchlist = async (
    userId: string | null,
    tmdbId: string | number | null,
    status: WatchStatus,
    contentId?: number | null
  ): Promise<SerieEpisodeWatchlist> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(
      `/serie-watchlist/${userId}/serie/${contentId}/episode/${tmdbId}`,
      {
        method: 'PUT',
        body: { status }
      }
    )

    return response.data?.episodeWatchlist
  }

  const removeWatchlist = async (
    userId: string | null,
    tmdbId: string | number | null,
    contentId?: number | null
  ): Promise<any> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    await apiFetch(`/serie-watchlist/${userId}/serie/${contentId}/episode/${tmdbId}`, {
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
