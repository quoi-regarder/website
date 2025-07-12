export const useProfileChannel = () => {
  const authStore = useAuthStore()
  const switchLocalePath = useSwitchLocalePath()
  const profileService = useProfileService()
  const profile = ref<Profile | null>(null)
  const colorMode = useColorMode()
  const { $sse } = useNuxtApp()

  const isAuthenticated = computed(
    () => authStore.isAuthenticated && !!authStore.getToken && !!authStore.getUserId
  )

  const sseUrl = computed<string | undefined>(() => {
    if (!isAuthenticated.value) return undefined
    return $sse.createAuthSseUrl('/api/notifications', authStore.getToken)
  })

  const connectionKey = 'notifications-channel'

  const {
    isConnected,
    error: connectionError,
    reconnect,
    addEventListener,
    disconnect
  } = useSse(sseUrl, connectionKey, {
    immediate: false
  })

  const onProfileUpdate = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      profile.value = data

      if (profile.value?.language) {
        switchLocalePath(formatLanguageToString(profile.value.language))
      }

      if (profile.value?.colorMode) {
        colorMode.preference = profile.value.colorMode || 'system'
      }
    } catch (error) {
      console.error('Error parsing profile update.')
    }
  }

  const fetchProfile = async () => {
    const fetchedProfile: Profile | null = await profileService.getProfile(authStore.getUserId)

    if (!fetchedProfile) return

    profile.value = fetchedProfile
    switchLocalePath(formatLanguageToString(profile.value?.language as string))
    colorMode.preference = (profile.value?.colorMode as string) || 'system'
  }

  onMounted(async () => {
    if (!isAuthenticated.value) return

    await fetchProfile()
    addEventListener(SseEventType.PROFILE_UPDATE, onProfileUpdate)
    reconnect()
  })

  watch(isAuthenticated, (newAuthStatus, oldAuthStatus) => {
    if (newAuthStatus && !oldAuthStatus) {
      fetchProfile().then(() => {
        addEventListener(SseEventType.PROFILE_UPDATE, onProfileUpdate)
        reconnect()
      })
    } else if (!newAuthStatus && oldAuthStatus) {
      disconnect()
      profile.value = null
    }
  })

  return {
    profile
  }
}
