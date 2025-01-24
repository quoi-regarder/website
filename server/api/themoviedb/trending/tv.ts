export default defineEventHandler(async (event) => {
  const { tmdbBaseUrl } = useRuntimeConfig()
  const { query, language, page } = getQuery(event)

  // console.log('query:', query)
  // console.log('language:', language)
  // console.log('page:', page)

  const manager = new QueryParamsManager('3/trending/tv/day', tmdbBaseUrl)
  if (query) manager.add('query', query as string)
  manager.add('language', formatLanguageToISO(language as string))
  manager.add('include_adult', 'false')
  manager.add('page', page as string)

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
