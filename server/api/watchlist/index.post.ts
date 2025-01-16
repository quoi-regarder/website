import { serverSupabaseServiceRole } from '#supabase/server'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)

  const body: { user_id: string; movie_id: string } = await readBody(event)

  if (!body.user_id || !body.movie_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'bad_request',
      statusText: 'userId and movieId are required'
    })
  }

  const { error } = await client.from<Tables<'user_movie_lists'>>('user_movie_lists').insert({
    user_id: body.user_id,
    tmdb_id: body.movie_id
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
