import { serverSupabaseClient } from '#supabase/server'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
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
    .from('profiles')
    .select('*')
    .eq('id', id)
    .returns<Tables<'profiles'>>()
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
