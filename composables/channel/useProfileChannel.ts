import { RealtimeChannel } from '@supabase/channel-js'

export function useProfileChannel () {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const profile = ref<Tables<'profiles'> | null>(null)
  let profileChannel: RealtimeChannel | null = null
  const switchLocalePath = useSwitchLocalePath()
  const colorMode = useColorMode()

  const fetchProfile = async () => {
    if (!user.value) return
    try {
      const manager = new QueryParamsManager(`/api/profiles/${user.value.id}`)

      profile.value = await $fetch(manager.toString(), {
        method: 'GET'
      })
      navigateTo(switchLocalePath(profile.value?.language as string))
      colorMode.preference = profile.value?.color_mode as string
    } catch (error: any) {
      console.error('Error fetching profile:', error)
    }
  }

  const setupChannel = () => {
    if (!user.value) return

    profileChannel = client.channel('auth-profile').on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${user.value?.id}`
      },
      (payload: any) => {
        profile.value = payload.new
      }
    )
    profileChannel.subscribe()
  }

  const cleanupChannel = () => {
    if (profileChannel) {
      profileChannel.unsubscribe()
      profileChannel = null
    }
  }

  onMounted(() => {
    fetchProfile().then(
      () => {
        setupChannel()
      },
      (error) => {
        console.error('Error fetching profile:', error)
      }
    )
  })

  onUnmounted(() => {
    cleanupChannel()
  })

  return {
    profile,
    setupChannel,
    cleanupChannel,
    fetchProfile
  }
}
