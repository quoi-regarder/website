export default defineEventHandler(async (event) => {
  const { tmdbBaseUrl } = useRuntimeConfig()
  const { query, language } = getQuery(event)

  const manager = new QueryParamsManager('3/search/tv', tmdbBaseUrl)
  if (query) manager.add('query', query as string)
  manager.add('language', formatLanguageToISO(language as string))
  manager.add('include_adult', 'false')

  try {
    return await tmdbFetch(manager.toString())
  } catch (error) {
    console.error('Error fetching data from TMDB:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch data from TMDB API'
    })
  }
})
