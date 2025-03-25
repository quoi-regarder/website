export const useMovieWatchlistService = (): WatchlistService => {
  const getWatchlist = async (userId: string | null): Promise<ApiResponse<MovieIds>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }
    const response: ApiResponse<MovieIds> = await apiFetch(`/movie-watchlist/${userId}/movie`)

    if (!response.success) {
      console.error('Failed to fetch movie watchlist.')
    }

    return response
  }

  const getWatchlistWithDetails = async (
    userId: string | null,
    status: WatchStatus,
    page: number,
    limit: number = 10
  ): Promise<ApiResponse<Pagination<Movie>>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<Pagination<Movie>> = await apiFetch(
      `/movie-watchlist/${userId}/movie/details?status=${status}&page=${page}&limit=${limit}`
    )

    if (!response.success) {
      console.error('Failed to fetch movie watchlist.')
    }

    return response
  }

  const createWatchlist = async (
    userId: string | null,
    data: MovieWatchlist
  ): Promise<ApiResponse<MovieWatchlist>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<MovieWatchlist> = await apiFetch(
      `/movie-watchlist/${userId}/movie`,
      {
        method: 'POST',
        body: data
      }
    )

    if (!response.success) {
      console.error('Error during movie watchlist creation.')
    }

    return response
  }

  const updateWatchlist = async (
    userId: string | null,
    tmdbId: string | number | null,
    status: WatchStatus
  ): Promise<ApiResponse<MovieWatchlist>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<MovieWatchlist> = await apiFetch(
      `/movie-watchlist/${userId}/movie/${tmdbId}`,
      {
        method: 'PUT',
        body: { status }
      }
    )

    if (!response.success) {
      console.error('Failed to update movie watchlist.')
    }

    return response
  }

  const removeWatchlist = async (
    userId: string | null,
    tmdbId: number | string
  ): Promise<ApiResponse<void>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<void> = await apiFetch(
      `/movie-watchlist/${userId}/movie/${tmdbId}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.success) {
      console.error('Failed to remove movie from watchlist.')
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
