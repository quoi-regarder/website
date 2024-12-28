import { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { Tables } from '~/types/supabase'

export default defineEventHandler(async (event: H3Event) => {
  const client = await serverSupabaseClient(event)

  const { data, error } = await client.from('profiles').select('*').returns<Tables<'profiles'>[]>()

  return data
})
