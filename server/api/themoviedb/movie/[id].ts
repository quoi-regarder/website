export default defineEventHandler(async (event) => {
  const { tmdbBaseUrl } = useRuntimeConfig()
  const { language } = getQuery(event)
  const id = getRouterParam(event, 'id')

  const manager = new QueryParamsManager(`3/movie/${id}`, tmdbBaseUrl)
  if (language) manager.add('language', formatLanguageToISO(language as string))
  manager.addWithLogic(
    'append_to_response',
    ['videos', 'credits', 'watch/providers'],
    LogicalOperator.AND
  )

  return await tmdbFetch(manager.toString())
})
