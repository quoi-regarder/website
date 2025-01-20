import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'bad_request',
      statusText: 'id is required'
    })
  }

  const { data } = await client
    .from('movies')
    .select('*, movie_translations(*)')
    .eq('tmdb_id', id)
    .single()

  if (!data) {
    throw createError({
      statusCode: 204,
      statusMessage: 'no_content',
      statusText: 'Profile not found'
    })
  }

  return data
})
