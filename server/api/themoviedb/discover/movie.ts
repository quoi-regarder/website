export default defineEventHandler(async (event) => {
  const {
    language,
    page,
    with_genres,
    with_watch_providers,
    vote_average_gte,
    sort_by,
    certification,
    with_keywords,
    release_date_gte,
    release_date_lte,
    with_runtime_gte,
    with_runtime_lte,
    with_watch_monetization_types,
    vote_count_gte,
    vote_count_lte,
    with_people,
    with_companies
  } = getQuery(event)

  const baseParams = {
    include_adult: false,
    include_video: false,
    language,
    page,
    watch_region: formatLanguageToString(language as string),
    certification_country: formatLanguageToString(language as string),
    ...(release_date_gte || release_date_lte
      ? {
          with_release_type: 3,
          region: formatLanguageToString(language as string)
        }
      : {})
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
        ...(with_keywords && { with_keywords }),
        ...(release_date_gte && { 'release_date.gte': release_date_gte }),
        ...(release_date_lte && { 'release_date.lte': release_date_lte }),
        ...(with_runtime_gte && { 'with_runtime.gte': with_runtime_gte }),
        ...(with_runtime_lte && { 'with_runtime.lte': with_runtime_lte }),
        ...(with_watch_monetization_types && {
          with_watch_monetization_types
        }),
        ...(vote_count_gte && { 'vote_count.gte': vote_count_gte }),
        ...(vote_count_lte && { 'vote_count.lte': vote_count_lte }),
        ...(with_people && { with_people }),
        ...(with_companies && { with_companies })
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
