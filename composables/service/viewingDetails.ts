export const useViewingDetailsService = () => {
  const getViewingDetails = async (
    userId: string | null,
    tmdbId: string | number | null
  ): Promise<ApiResponse<ViewingDetails>> => {
    const response: ApiResponse<ViewingDetails> = await apiFetch(
      `/viewing-details/${userId}/${tmdbId}`
    )

    return response
  }

  const createViewingDetails = async (
    userId: string | null,
    data: ViewingDetails
  ): Promise<ApiResponse<ViewingDetails>> => {
    const response: ApiResponse<ViewingDetails> = await apiFetch(`/viewing-details/${userId}`, {
      method: 'POST',
      body: data
    })

    return response
  }

  const updateViewingDetails = async (
    userId: string | null,
    tmdbId: string | number | null,
    data: ViewingDetails
  ): Promise<ApiResponse<ViewingDetails>> => {
    const response: ApiResponse<ViewingDetails> = await apiFetch(
      `/viewing-details/${userId}/${tmdbId}`,
      {
        method: 'PUT',
        body: data
      }
    )

    return response
  }

  const deleteViewingDetails = async (
    userId: string | null,
    tmdbId: string | number | null
  ): Promise<ApiResponse<void>> => {
    const response: ApiResponse<void> = await apiFetch(`/viewing-details/${userId}/${tmdbId}`, {
      method: 'DELETE'
    })

    return response
  }
  return {
    getViewingDetails,
    createViewingDetails,
    updateViewingDetails,
    deleteViewingDetails
  }
}
