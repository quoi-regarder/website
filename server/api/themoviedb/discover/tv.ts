export default defineEventHandler(async (event) => {
  const {
    language,
    page,
    with_genres,
    with_watch_providers,
    vote_average_gte,
    sort_by,
    with_companies,
    with_watch_monetization_types,
    first_air_date_gte,
    first_air_date_lte,
    vote_count_gte,
    certification,
    with_runtime_gte,
    with_runtime_lte,
    air_date_gte,
    air_date_lte
  } = getQuery(event)

  const baseParams = {
    include_adult: false,
    include_null_first_air_dates: false,
    language: formatLanguageToISO(language as string),
    page,
    watch_region: formatLanguageToCountryCode(language as string),
    certification_country: formatLanguageToCountryCode(language as string)
  }

  try {
    return await tmdbFetch('3/discover/tv', {
      params: {
        ...baseParams,
        ...(with_genres && { with_genres }),
        ...(with_watch_providers && { with_watch_providers }),
        ...(vote_average_gte && { 'vote_average.gte': vote_average_gte }),
        ...(sort_by && { sort_by }),
        ...(with_companies && { with_companies }),
        ...(with_watch_monetization_types && {
          with_watch_monetization_types
        }),
        ...(first_air_date_gte && { 'first_air_date.gte': first_air_date_gte }),
        ...(first_air_date_lte && { 'first_air_date.lte': first_air_date_lte }),
        ...(vote_count_gte && { 'vote_count.gte': vote_count_gte }),
        ...(certification && { certification }),
        ...(with_runtime_gte && { 'with_runtime.gte': with_runtime_gte }),
        ...(with_runtime_lte && { 'with_runtime.lte': with_runtime_lte }),
        ...(air_date_gte && { 'air_date.gte': air_date_gte }),
        ...(air_date_lte && { 'air_date.lte': air_date_lte })
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
