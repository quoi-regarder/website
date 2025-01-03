import type { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event: H3Event) => {
  const client = await serverSupabaseClient(event)

  const { data } = await client.from('profiles').select('*').returns<Tables<'profiles'>[]>()

  return data
})
