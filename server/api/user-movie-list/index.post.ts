import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body: Tables<'user_movie_list'> = await readBody(event)

  const { data } = await client.from('user_movie_list').upsert(body)

  if (!data) {
    throw createError({
      statusCode: 204,
      statusMessage: 'no_content',
      statusText: 'Profile not found'
    })
  }

  return data
})
