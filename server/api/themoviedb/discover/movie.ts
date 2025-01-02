export default defineEventHandler(async (event) => {
  const { language, page } = getQuery(event)

  try {
    return await tmdbFetch('3/discover/movie', {
      params: {
        language,
        page
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
