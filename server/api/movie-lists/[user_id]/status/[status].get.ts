import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const user_id = getRouterParam(event, 'user_id')
  const status = getRouterParam(event, 'status')
  const { language } = getQuery(event)

  const { data: movieList, error } = await client
    .from('user_movie_lists')
    .select('*, movies(*, movie_translations(*))')
    .eq('user_id', user_id as string)
    .eq('status', status as string)
    .eq('movies.movie_translations.language', formatLanguageToISO(language as string))
    .returns<Tables<'user_movie_lists'>[]>()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'internal_server_error',
      statusText: error.message
    })
  }

  return movieList
})
