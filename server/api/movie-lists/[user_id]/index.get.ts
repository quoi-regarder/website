import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const user_id = getRouterParam(event, 'user_id')

  const { data: movieList, error } = await client
    .from<Tables<'user_movie_lists'>>('user_movie_lists')
    .select('*')
    .eq('user_id', user_id)
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
