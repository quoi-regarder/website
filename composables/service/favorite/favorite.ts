export interface FavoriteService {
  /**
   *
   * @param userId User ID
   *
   * @returns Favorite object
   *
   * @description Get favorite object.
   */
  getFavorite(userId: string | null): Promise<ApiResponse<any>>

  /**
   *
   * @param userId User ID
   * @param page Page number (starting from 1)
   * @param limit Number of items per page
   *
   * @returns Favorite object with details. Only available for movies and series.
   */
  getFavoriteWithDetails?(
    userId: string | null,
    page: number,
    limit: number
  ): Promise<ApiResponse<any>>

  /**
   *
   * @param userId User ID
   * @param data Favorite object
   *
   * @returns Favorite object
   *
   * @description Create a new favorite object.
   */
  createFavorite(userId: string | null, data: MovieFavorite): Promise<ApiResponse<any>>

  /**
   *
   * @param userId User ID
   * @param tmdbId Content ID
   * @returns Favorite object
   *
   * @description Remove a content from the favorite list.
   */
  removeFavorite(userId: string | null, tmdbId: number): Promise<ApiResponse<any>>
}
