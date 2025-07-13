export default defineEventHandler(async (event) => {
  const { tmdbBaseUrl } = useRuntimeConfig()
  const { language } = getQuery(event)

  const manager = new QueryParamsManager('3/genre/tv/list', tmdbBaseUrl)
  if (language) manager.add('language', formatLanguageToISO(language as string))

  try {
    return await tmdbFetch('3/genre/tv/list', {
      params: {
        language: formatLanguageToISO(language as string)
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
