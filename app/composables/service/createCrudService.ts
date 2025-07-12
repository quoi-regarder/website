interface CrudServiceConfig {
  endpoint: string
  entityType: string
}

interface FavoriteService<TEntity, TIds> {
  getFavorite: (userId: string | null) => Promise<ApiResponse<TIds>>
  getFavoriteWithDetails: (
    userId: string | null,
    page: number,
    limit?: number
  ) => Promise<ApiResponse<Pagination<TEntity>>>
  createFavorite: (userId: string | null, data: any) => Promise<ApiResponse<TEntity>>
  removeFavorite: (userId: string | null, tmdbId: number) => Promise<ApiResponse<TEntity>>
}

interface WatchlistService<TEntity, TIds> {
  getWatchlist: (userId: string | null) => Promise<ApiResponse<TIds>>
  getWatchlistWithDetails: (
    userId: string | null,
    status: WatchStatus,
    page: number,
    limit?: number
  ) => Promise<ApiResponse<Pagination<TEntity>>>
  createWatchlist: (userId: string | null, data: any) => Promise<ApiResponse<TEntity>>
  updateWatchlist: (
    userId: string | null,
    tmdbId: string | number | null,
    status: WatchStatus
  ) => Promise<ApiResponse<TEntity>>
  removeWatchlist: (userId: string | null, tmdbId: number | string) => Promise<ApiResponse<void>>
}

export function createFavoriteService<TEntity, TIds> (
  config: CrudServiceConfig
): FavoriteService<TEntity, TIds> {
  const { endpoint, entityType } = config

  const getFavorite = async (userId: string | null): Promise<ApiResponse<TIds>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<TIds> = await apiFetch(`/${endpoint}/${userId}/${entityType}`)

    if (!response.success) {
      console.error(`Failed to fetch ${entityType} favorite.`)
    }

    return response
  }

  const getFavoriteWithDetails = async (
    userId: string | null,
    page: number,
    limit: number = 20
  ): Promise<ApiResponse<Pagination<TEntity>>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<Pagination<TEntity>> = await apiFetch(
      `/${endpoint}/${userId}/${entityType}/details?page=${page}&limit=${limit}`
    )

    if (!response.success) {
      console.error(`Failed to fetch ${entityType} favorite with details.`)
    }

    return response
  }

  const createFavorite = async (
    userId: string | null,
    data: any
  ): Promise<ApiResponse<TEntity>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<TEntity> = await apiFetch(`/${endpoint}/${userId}/${entityType}`, {
      method: 'POST',
      body: data
    })

    if (!response.success) {
      console.error(`Error during ${entityType} favorite creation.`)
    }

    return response
  }

  const removeFavorite = async (
    userId: string | null,
    tmdbId: number
  ): Promise<ApiResponse<TEntity>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<TEntity> = await apiFetch(
      `/${endpoint}/${userId}/${entityType}/${tmdbId}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.success) {
      console.error(`Error during ${entityType} favorite deletion.`)
    }

    return response
  }

  return {
    getFavorite,
    getFavoriteWithDetails,
    createFavorite,
    removeFavorite
  }
}

export function createWatchlistService<TEntity, TIds> (
  config: CrudServiceConfig
): WatchlistService<TEntity, TIds> {
  const { endpoint, entityType } = config

  const getWatchlist = async (userId: string | null): Promise<ApiResponse<TIds>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<TIds> = await apiFetch(`/${endpoint}/${userId}/${entityType}`)

    if (!response.success) {
      console.error(`Failed to fetch ${entityType} watchlist.`)
    }

    return response
  }

  const getWatchlistWithDetails = async (
    userId: string | null,
    status: WatchStatus,
    page: number,
    limit: number = 20
  ): Promise<ApiResponse<Pagination<TEntity>>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<Pagination<TEntity>> = await apiFetch(
      `/${endpoint}/${userId}/${entityType}/details?status=${status}&page=${page}&limit=${limit}`
    )

    if (!response.success) {
      console.error(`Failed to fetch ${entityType} watchlist.`)
    }

    return response
  }

  const createWatchlist = async (
    userId: string | null,
    data: any,
    primaryId?: number
  ): Promise<ApiResponse<TEntity>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<TEntity> = await apiFetch(`/${endpoint}/${userId}/${entityType}`, {
      method: 'POST',
      body: data
    })

    if (!response.success) {
      console.error(`Error during ${entityType} watchlist creation.`)
    }

    return response
  }

  const updateWatchlist = async (
    userId: string | null,
    tmdbId: string | number | null,
    status: WatchStatus,
    primaryId?: number
  ): Promise<ApiResponse<TEntity>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<TEntity> = await apiFetch(
      `/${endpoint}/${userId}/${entityType}/${tmdbId}`,
      {
        method: 'PUT',
        body: { status }
      }
    )

    if (!response.success) {
      console.error(`Failed to update ${entityType} watchlist.`)
    }

    return response
  }

  const removeWatchlist = async (
    userId: string | null,
    tmdbId: number | string,
    primaryId?: number
  ): Promise<ApiResponse<void>> => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const response: ApiResponse<void> = await apiFetch(
      `/${endpoint}/${userId}/${entityType}/${tmdbId}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.success) {
      console.error(`Failed to remove ${entityType} from watchlist.`)
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
