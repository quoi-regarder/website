export default defineEventHandler(async (event) => {
  const {
    language,
    page,
    with_genres,
    with_watch_providers,
    vote_average_gte,
    sort_by,
    certification,
    with_keywords
  } = getQuery(event)

  const baseParams = {
    include_adult: false,
    include_video: false,
    language,
    page,
    watch_region: formatLanguageToString(language as string),
    certification_country: formatLanguageToString(language as string)
  }

  try {
    return await tmdbFetch('3/discover/movie', {
      params: {
        ...baseParams,
        ...(with_genres && { with_genres }),
        ...(with_watch_providers && { with_watch_providers }),
        ...(vote_average_gte && { 'vote_average.gte': vote_average_gte }),
        ...(sort_by && { sort_by }),
        ...(certification && { certification }),
        ...(with_keywords && { with_keywords })
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
