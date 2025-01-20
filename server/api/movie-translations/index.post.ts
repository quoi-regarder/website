import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)
  const body: Tables<'movie_translations'> = await readBody(event)

  const { data } = await client.from('movie_translations').insert(body)

  if (!data) {
    throw createError({
      statusCode: 204,
      statusMessage: 'no_content',
      statusText: 'Profile not found'
    })
  }

  return data
})
