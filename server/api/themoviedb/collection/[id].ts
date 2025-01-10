export default defineEventHandler(async (event) => {
  const { tmdbBaseUrl } = useRuntimeConfig()
  const { language } = getQuery(event)
  const id = getRouterParam(event, 'id')

  const manager = new QueryParamsManager(`3/collection/${id}`, tmdbBaseUrl)
  if (language) manager.add('language', formatLanguageToISO(language as string))

  return await tmdbFetch(manager.toString())
})
