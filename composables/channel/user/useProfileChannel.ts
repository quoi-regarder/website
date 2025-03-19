export const useProfileChannel = () => {
  const authStore = useAuthStore()
  const switchLocalePath = useSwitchLocalePath()
  const profileService = useProfileService()
  const profile = ref<Profile | null>(null)
  const colorMode = useColorMode()
  const { $sse } = useNuxtApp()

  // Check authentication status
  const isAuthenticated = computed(
    () => authStore.isAuthenticated && !!authStore.getToken && !!authStore.getUserId
  )

  // Create the SSE URL with authentication token
  const sseUrl = computed<string | undefined>(() => {
    if (!isAuthenticated.value) return undefined
    return $sse.createAuthSseUrl('/api/notifications', authStore.getToken)
  })

  // Connection key
  const connectionKey = computed(() =>
    isAuthenticated.value ? `profile-${authStore.getUserId}` : ''
  )

  // Use our SSE composable
  const {
    isConnected,
    error: connectionError,
    reconnect,
    addEventListener,
    disconnect
  } = useSse(sseUrl, connectionKey.value, {
    immediate: false,
    onError: (error) => {
      console.error('Profile channel SSE error:', error)
    }
  })

  // Handler for profile update events
  const onProfileUpdate = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      profile.value = data

      // Update user preferences based on profile
      if (profile.value?.language) {
        switchLocalePath(formatLanguageToString(profile.value.language))
      }

      if (profile.value?.colorMode) {
        colorMode.preference = profile.value.colorMode || 'system'
      }
    } catch (error) {
      console.error('Error parsing profile update:', error)
    }
  }

  // Initial profile fetch
  const fetchProfile = async () => {
    const fetchedProfile: Profile | null = await profileService.getProfile(authStore.getUserId)

    if (!fetchedProfile) return

    profile.value = fetchedProfile
    switchLocalePath(formatLanguageToString(profile.value?.language as string))
    colorMode.preference = (profile.value?.colorMode as string) || 'system'
  }

  // Initialize on component mount
  onMounted(async () => {
    if (!isAuthenticated.value) return

    // Fetch initial profile data
    await fetchProfile()

    // Set up event listeners
    addEventListener('PROFILE_UPDATE', onProfileUpdate)

    // Connect
    reconnect()
  })

  // Watch for auth status changes
  watch(isAuthenticated, (newAuthStatus, oldAuthStatus) => {
    if (newAuthStatus && !oldAuthStatus) {
      // User just logged in
      fetchProfile().then(() => {
        addEventListener('PROFILE_UPDATE', onProfileUpdate)
        reconnect()
      })
    } else if (!newAuthStatus && oldAuthStatus) {
      // User just logged out
      disconnect()
      profile.value = null
    }
  })

  return {
    profile,
    isConnected,
    connectionError,
    reconnect
  }
}
