import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)

  const user_id = getRouterParam(event, 'user_id')
  const movie_id = getRouterParam(event, 'movie_id')

  const body: { status: Enums<'movie_list_status'> } = await readBody(event)

  if (!user_id || !movie_id || !body.status) {
    throw createError({
      statusCode: 400,
      statusMessage: 'bad_request',
      statusText: 'userId, movieId and status are required'
    })
  }

  const { error } = await client.from<Tables<'user_movie_lists'>>('user_movie_lists').upsert({
    user_id,
    tmdb_id: movie_id,
    status: body.status
  })

  if (error) {
    console.error('error', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'internal_server_error',
      statusText: error.message
    })
  }
})
