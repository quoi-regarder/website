export default defineEventHandler(async (event) => {
  const { tmdbBaseUrl } = useRuntimeConfig()
  const { language } = getQuery(event)
  const id = getRouterParam(event, 'id')
  const season_number = getRouterParam(event, 'number')

  const manager = new QueryParamsManager(`3/tv/${id}/season/${season_number}`, tmdbBaseUrl)
  if (language) manager.add('language', formatLanguageToISO(language as string))

  return await tmdbFetch(manager.toString())
})
