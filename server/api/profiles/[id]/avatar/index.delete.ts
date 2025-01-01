import { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

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

  // Remove avatar from storage
  if (data?.avatar_url) {
    const avatarId = data?.avatar_url.split('/').pop().split('.').shift()
    const { error } = await client.storage.from('avatars').remove([`${avatarId}.webp`])

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'internal_server_error',
        statusText: 'Error removing avatar'
      })
    }
  }

  // Remove avatar_url from profiles
  const { error } = await client.from('profiles').update({ avatar_url: null }).eq('id', id)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'internal_server_error',
      statusText: 'Error updating profile'
    })
  }

  return
})
