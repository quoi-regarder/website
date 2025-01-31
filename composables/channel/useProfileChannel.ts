import { Transmit } from '@adonisjs/transmit-client'

export const useProfileChannel = () => {
  const { isAuthenticated, getUserId } = useAuthStore()
  const transmit = shallowRef<Transmit | null>(null)
  const switchLocalePath = useSwitchLocalePath()
  const runtimeConfig = useRuntimeConfig()
  const profileService = useProfileService()
  const profile = ref<Profile | null>(null)
  const colorMode = useColorMode()

  const fetchProfile = async () => {
    const fetchedProfile: Profile = await profileService.getProfile(getUserId.value)

    if (!fetchedProfile) {
      throw new Error('Failed to fetch user profile')
    }

    profile.value = fetchedProfile
    switchLocalePath(formatLanguageToString(profile.value?.language as string))
    colorMode.preference = (profile.value?.colorMode as string) || 'system'
  }

  const setupChannel = async () => {
    if (!transmit.value || !getUserId.value) return

    try {
      const subscription = transmit.value.subscription(`profiles:${getUserId.value}`)
      await subscription.create()

      subscription.onMessage((data: any) => {
        profile.value = data?.profile as Profile
      })
    } catch (error) {
      console.error('Failed to setup channel:', error)
    }
  }

  onMounted(async () => {
    if (!isAuthenticated.value) return

    transmit.value = new Transmit({
      baseUrl: runtimeConfig.public.apiBaseUrl
    })

    await fetchProfile()
    await setupChannel()
  })

  onUnmounted(() => {
    transmit.value?.close()
    transmit.value = null
  })

  return {
    profile
  }
}
