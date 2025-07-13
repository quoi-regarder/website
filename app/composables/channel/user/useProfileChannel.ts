export const useProfileChannel = () => {
  const profileStore = useProfileStore()
  const authStore = useAuthStore()
  const colorMode = useColorMode()
  const { subscribe } = useSseManager()

  let unsubscribe: (() => void) | null = null

  const onProfileUpdate = (data: any) => {
    try {
      profileStore.setProfile(data)

      if (data.language) {
        const switchLocalePath = useSwitchLocalePath()
        switchLocalePath(formatLanguageToString(data.language))
      }

      if (data.colorMode) {
        colorMode.preference = data.colorMode || 'system'
      }
    } catch (error) {
      console.error('Error processing profile update:', error)
    }
  }

  const init = async () => {
    if (!authStore.isAuthenticated || unsubscribe) return

    try {
      const profileService = useProfileService()
      const profile = await profileService.getProfile(authStore.getUserId)

      if (profile) {
        profileStore.setProfile(profile)
        const switchLocalePath = useSwitchLocalePath()
        switchLocalePath(formatLanguageToString(profile.language as string))
        colorMode.preference = (profile.colorMode as string) || 'system'
      }

      unsubscribe = subscribe(SseEventType.PROFILE_UPDATE, onProfileUpdate)
    } catch (error) {
      console.error('Error initializing profile channel:', error)
    }
  }

  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  const isActive = computed(() => !!unsubscribe)

  // Auto-init if authenticated
  if (import.meta.client && authStore.isAuthenticated) {
    init()
  }

  // Watch auth changes
  watch(
    () => authStore.isAuthenticated,
    (newAuth, oldAuth) => {
      if (newAuth && !oldAuth) {
        init()
      } else if (!newAuth && oldAuth) {
        cleanup()
      }
    }
  )

  return {
    cleanup,
    isActive
  }
}
