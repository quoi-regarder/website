export const useProfileChannel = () => {
  const authStore = useAuthStore()
  const switchLocalePath = useSwitchLocalePath()
  const profileService = useProfileService()
  const profile = ref<Profile | null>(null)
  const colorMode = useColorMode()
  const { $transmit } = useNuxtApp()

  const fetchProfile = async () => {
    const fetchedProfile: Profile | null = await profileService.getProfile(authStore.getUserId)

    if (!fetchedProfile) {
      return
    }

    profile.value = fetchedProfile
    switchLocalePath(formatLanguageToString(profile.value?.language as string))
    colorMode.preference = (profile.value?.colorMode as string) || 'system'
  }

  const setupChannel = async () => {
    if (!$transmit || !authStore.getUserId) return

    try {
      const subscription = $transmit.subscription(`profiles/${authStore.getUserId}`)
      await subscription.create()

      subscription.onMessage((data: any) => {
        profile.value = data?.profile as Profile
      })
    } catch (error) {
      console.error('Failed to setup channel:', error)
    }
  }

  onMounted(async () => {
    if (authStore.isAuthenticated === false) return

    await fetchProfile()
    await setupChannel()
  })

  return {
    profile
  }
}
