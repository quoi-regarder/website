import { serverSupabaseClient } from '#supabase/server'
import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const client = await serverSupabaseClient(event)
  const body: Tables<'profiles'> = await readBody(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'bad_request',
      statusText: 'id is required'
    })
  }

  const { data, error } = await client
    .from('profiles')
    .update(body)
    .eq('id', id)
    .returns<Tables<'profiles'>>()
    .single()

  if (error) {
    switch (error.code) {
      case '23505':
        throw createError({
          statusCode: 409,
          statusMessage: 'username_already_exists',
          statusText: 'Username already exists'
        })
      default:
        throw createError({
          statusCode: 500,
          statusMessage: 'internal_server_error',
          statusText: 'Error updating profile'
        })
    }
  }

  return data
})
