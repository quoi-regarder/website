import { Transmit } from '@adonisjs/transmit-client'

export const useSerieEpisodeListChannel = () => {
  const { setEpisodes, reset } = useEpisodeListStore()
  const { isAuthenticated, getUserId } = useAuthStore()
  const transmit = shallowRef<Transmit | null>(null)
  const runtimeConfig = useRuntimeConfig()

  const setupChannel = async () => {
    if (!transmit.value || !getUserId.value) return

    try {
      const subscription = transmit.value.subscription(`serie_episode_watchlist:${getUserId.value}`)
      await subscription.create()

      subscription.onMessage((data: any) => {
        switch (data?.type) {
          case 'list':
            setEpisodes(data.episodes)
            break
        }
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

    await setupChannel()
  })

  onUnmounted(() => {
    transmit.value?.close()
    transmit.value = null
  })
  reset()
}
