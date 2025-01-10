export default defineEventHandler(async (event) => {
  const { tmdbBaseUrl } = useRuntimeConfig()
  const { language } = getQuery(event)

  try {
    return await tmdbFetch('3/watch/providers/tv', {
      params: {
        language: formatLanguageToISO(language as string),
        watch_region: language
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
