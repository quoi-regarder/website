export default defineEventHandler(async (event) => {
  const { tmdbBaseUrl } = useRuntimeConfig()
  const { query } = getQuery(event)

  const manager = new QueryParamsManager('3/search/keyword', tmdbBaseUrl)
  if (query) manager.add('query', query as string)

  try {
    return await tmdbFetch('3/search/keyword', {
      params: {
        query
      }
    })
  } catch (error) {
    console.error('Error fetching data from TMDB:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch data from TMDB API'
    })
  }
})
