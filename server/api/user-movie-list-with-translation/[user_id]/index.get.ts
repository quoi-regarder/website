import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user_id = getRouterParam(event, 'user_id')
  const { language } = getQuery(event)

  const { data: movieList, error } = await client
    .from('user_movie_list_with_translation')
    .select('*')
    .eq('user_id', user_id as string)
    .eq('language', formatLanguageToISO(language as string))
    .returns<Tables<'user_movie_list'>[]>()

  if (error) {
    console.error('Error fetching movie list:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'internal_server_error',
      statusText: error.message
    })
  }
  return movieList
})
