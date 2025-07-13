export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  const initializeChannels = () => {
    if (!authStore.isAuthenticated || !authStore.getToken) {
      return
    }

    try {
      useProfileChannel()
      useMovieFavoriteChannel()
      useSerieFavoriteChannel()
      useMovieListChannel()
      useSerieListChannel()
    } catch (error) {
      console.error('Error initializing SSE channels:', error)
    }
  }

  if (authStore.isAuthenticated) {
    initializeChannels()
  }

  watch(
    () => authStore.isAuthenticated,
    (isAuthenticated) => {
      if (isAuthenticated) {
        initializeChannels()
      }
    }
  )
})
