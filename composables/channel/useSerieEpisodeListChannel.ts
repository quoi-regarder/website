export const useSerieEpisodeListChannel = () => {
  const episodeListStore = useEpisodeListStore()
  const authStore = useAuthStore()
  const { $transmit } = useNuxtApp()

  const setupChannel = async () => {
    if (!$transmit || !authStore.getUserId) return

    try {
      const subscription = $transmit.subscription(`serie_episode_watchlist/${authStore.getUserId}`)
      await subscription.create()

      subscription.onMessage((data: any) => {
        episodeListStore.setWatchedIds(data.data.watched)
        episodeListStore.setWatchingIds(data.data.watching)
        episodeListStore.setToWatchIds(data.data.to_watch)
      })
    } catch (error) {
      console.error('Failed to setup channel:', error)
    }
  }

  onMounted(async () => {
    if (!authStore.isAuthenticated) return

    await setupChannel()
  })

  onUnmounted(() => {
    episodeListStore.reset()
  })
}
