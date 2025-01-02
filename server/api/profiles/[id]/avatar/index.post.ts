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

  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'bad_request',
      statusText: 'file is required'
    })
  }
  const file = formData[0]

  const profile = await client
    .from('profiles')
    .select('avatar_url')
    .eq('id', id)
    .returns<Tables<'profiles'>>()
    .single()

  // If avatar_url exists, delete the existing avatar
  if (profile.data?.avatar_url) {
    const avatarId = profile.data?.avatar_url.split('/').pop().split('.').shift()
    await client.storage.from('avatars').remove([`${avatarId}.webp`])
  }

  // Upload the new avatar
  const avatar = await client.storage
    .from('avatars')
    .upload(`avatar_${Date.now()}_${id}.webp`, file.data, {
      contentType: file.type
    })

  // Return the publicUrl
  const publicUrl = client.storage.from('avatars').getPublicUrl(avatar.data.path).data?.publicUrl

  await client.from('profiles').update({ avatar_url: publicUrl }).eq('id', id)
})
