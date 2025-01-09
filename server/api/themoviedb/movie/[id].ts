export default defineEventHandler(async (event) => {
  const { tmdbBaseUrl } = useRuntimeConfig()
  const { language } = getQuery(event)
  const id = getRouterParam(event, 'id')

  const manager = new QueryParamsManager(`3/movie/${id}`, tmdbBaseUrl)
  if (language) manager.add('language', language)
  manager.addWithLogic(
    'append_to_response',
    ['videos', 'credits', 'recommendations', 'similar', 'watch/providers'],
    LogicalOperator.AND
  )

  return await tmdbFetch(manager.toString())
})
