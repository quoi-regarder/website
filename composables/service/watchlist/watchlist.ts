export interface WatchlistService {
  /**
   *
   * @param userId User ID
   * @param primaryId Content ID (optional)
   * @param seasonNumber Season number (optional)
   *
   * @returns Watchlist object
   *
   * @description Get watchlist object.
   *
   * The content ID is optional and should be used only for seasons and episodes. In this case, the `primaryId` should be the serie ID.
   * The season number is optional and should be used only for episodes.
   */
  getWatchlist(
    userId: string | null,
    primaryId?: string | number | null,
    seasonNumber?: number | null
  ): Promise<ApiResponse<any>>

  /**
   *
   * @param userId User ID
   * @param status Watch status (to_watch, watching, watched)
   * @param page Page number (starting from 1)
   * @param limit Number of items per page
   *
   * @returns Watchlist object with details. Only available for movies and series.
   */
  getWatchlistWithDetails?(
    userId: string | null,
    status: WatchStatus,
    page: number,
    limit: number
  ): Promise<ApiResponse<any>>

  /**
   *
   * @param userId User ID
   * @param data Watchlist object
   * @param contentId Serie ID (optional)
   *
   * @returns Watchlist object
   *
   * @description Create a new watchlist object.
   *
   * Movies and series just need the `data` object and the `userId` to be created.
   *
   * Filed `contentId` is optional and should be used only for seasons and episodes. In this case, the `contentId` should be the serie ID.
   */
  createWatchlist(
    userId: string | null,
    data: MovieWatchlist,
    contentId?: number
  ): Promise<ApiResponse<any>>

  /**
   *
   * @param userId User ID
   * @param tmdbId Content ID
   * @param status Watch status (to_watch, watching, watched)
   * @param contentId Content ID (optional)
   * @returns Watchlist object
   *
   * @description Update watchlist object.
   *
   * The tmdb ID should be the movie ID for movies, the serie ID for series, the season ID for seasons, etc.
   *
   * Filed `contentId` is optional and should be used only for seasons and episodes. In this case, the `contentId` should be the serie ID.
   */
  updateWatchlist(
    userId: string | null,
    tmdbId: string | number | null,
    status: WatchStatus,
    contentId?: number
  ): Promise<ApiResponse<any>>

  /**
   *
   * @param userId User ID
   * @param tmdbId Content ID
   * @param contentId Content ID (optional)
   *
   * @returns void
   *
   * @description Remove content from watchlist.
   * The tmdb ID should be the movie ID for movies, the serie ID for series, the season ID for seasons, etc.
   *
   * Filed `contentId` is optional and should be used only for seasons and episodes. In this case, the `contentId` should be the serie ID.
   */
  removeWatchlist(
    userId: string | null,
    tmdbId: number | string,
    contentId?: number
  ): Promise<ApiResponse<any>>
}
