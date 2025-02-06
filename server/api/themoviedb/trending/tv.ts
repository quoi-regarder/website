export default defineEventHandler(async (event) => {
  const { tmdbBaseUrl } = useRuntimeConfig()
  const { language } = getQuery(event)

  const manager = new QueryParamsManager('3/trending/tv/day', tmdbBaseUrl)
  manager.add('language', formatLanguageToISO(language as string))

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
