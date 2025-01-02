import type { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

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

  const { data } = await client
    .from('profiles')
    .update({
      color_mode: body.color_mode
    })
    .eq('id', id)
    .returns<Tables<'profiles'>>()
    .single()

  return data
})
