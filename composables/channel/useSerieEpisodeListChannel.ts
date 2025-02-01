import { Transmit } from '@adonisjs/transmit-client'

export const useSerieEpisodeListChannel = () => {
  const episodeListStore = useEpisodeListStore()
  const authStore = useAuthStore()
  const transmit = shallowRef<Transmit | null>(null)
  const runtimeConfig = useRuntimeConfig()

  const setupChannel = async () => {
    if (!transmit.value || !authStore.getUserId) return

    try {
      const subscription = transmit.value.subscription(
        `serie_episode_watchlist:${authStore.getUserId}`
      )
      await subscription.create()

      subscription.onMessage((data: any) => {
        switch (data?.type) {
          case 'list':
            episodeListStore.setEpisodes(data.episodes)
            break
        }
      })
    } catch (error) {
      console.error('Failed to setup channel:', error)
    }
  }

  onMounted(async () => {
    if (!authStore.isAuthenticated) return

    transmit.value = new Transmit({
      baseUrl: runtimeConfig.public.apiBaseUrl
    })

    await setupChannel()
  })

  onUnmounted(() => {
    transmit.value?.close()
    transmit.value = null
  })
  episodeListStore.reset()
}
