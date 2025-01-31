export const useMovieWatchlistService = (): WatchlistService => {
  const getWatchlist = async (userId: string | null): Promise<MovieWatchlist> => {
    if (!userId) {
      throw new Error('User ID is required')
    }
    const response: ApiResponse = await apiFetch(`/movie-watchlist/${userId}/movie`)

    if (response.errors || response.errorStatus) {
      console.error('Failed to fetch movie watchlist:', response.errors, response.errorStatus)
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
      `/movie-watchlist/${userId}/movie/details?status=${status}&page=${page}&limit=${limit}`
    )

    if (response.errors || response.errorStatus) {
      console.error('Failed to fetch movie watchlist:', response.errors, response.errorStatus)
    }

    return response.data
  }

  const createWatchlist = async (
    userId: string | null,
    data: MovieWatchlist
  ): Promise<MovieWatchlist> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(`/movie-watchlist/${userId}/movie`, {
      method: 'POST',
      body: data
    })

    return response.data?.movieWatchlist
  }

  const updateWatchlist = async (
    userId: string | null,
    tmdbId: string | number | null,
    status: WatchStatus
  ): Promise<MovieWatchlist> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse = await apiFetch(`/movie-watchlist/${userId}/movie/${tmdbId}`, {
      method: 'PUT',
      body: { status }
    })

    return response.data?.movieWatchlist
  }

  const removeWatchlist = async (userId: string | null, tmdbId: number | string): Promise<void> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    await apiFetch(`/movie-watchlist/${userId}/movie/${tmdbId}`, {
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
