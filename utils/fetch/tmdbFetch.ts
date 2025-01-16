export async function tmdbFetch(
  path: string,
  {
    params = {},
    method = 'GET',
    baseUrl
  }: { params?: Record<string, any>; method?: string; baseUrl?: string } = {}
): Promise<any> {
  const { tmdbApiKey, tmdbBaseUrl } = useRuntimeConfig()

  const manager = new QueryParamsManager(path, baseUrl || tmdbBaseUrl)
  manager.add('api_key', tmdbApiKey)

  // Ajout des paramètres fournis
  Object.entries(params).forEach(([key, value]) => {
    manager.add(key, value)
  })

  return fetch(manager.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`TMDB API request failed: ${response.statusText}`)
      }
      return response.json()
    })
    .catch((error) => {
      console.error('Error with TMDB API request:', error)
      throw error
    })
}
