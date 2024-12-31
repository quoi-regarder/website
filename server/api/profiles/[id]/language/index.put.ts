import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import { H3Event } from 'h3'
import { Tables } from '~/types/supabase'

export default defineEventHandler(async (event: H3Event) => {
  const client = await serverSupabaseClient(event)
  const serviceClient = serverSupabaseServiceRole(event)
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
      language: body.language
    })
    .eq('id', id)
    .returns<Tables<'profiles'>>()
    .single()

  await serviceClient.auth.admin.updateUserById(id, {
    user_metadata: {
      language: body.language
    }
  })

  return data
})
