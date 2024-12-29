import {
  serverSupabaseClient,
  serverSupabaseServiceRole,
  serverSupabaseUser
} from '#supabase/server'
import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const client = await serverSupabaseClient(event)
  const serviceClient = serverSupabaseServiceRole(event)
  const user = await serverSupabaseUser(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'bad_request',
      statusText: 'id is required'
    })
  }

  if (id !== user?.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'forbidden',
      statusText: 'You are not allowed to delete this profile'
    })
  }

  client.auth.signOut({
    scope: 'global'
  })

  await serviceClient.auth.admin.deleteUser(id)
})
