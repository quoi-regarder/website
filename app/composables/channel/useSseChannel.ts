interface SseChannelConfig {
  onConnect?: () => Promise<void> | void
  onMessage?: (data: any) => void
  onError?: (error: Error) => void
}

interface SseChannelManager {
  isConnected: Ref<boolean>
  connectionError: Ref<Error | null>
  connect: (config?: SseChannelConfig) => boolean
  disconnect: () => boolean
  addEventListener: (eventType: SseEventType, handler: (event: MessageEvent) => void) => void
  removeEventListener: (eventType: SseEventType, handler: (event: MessageEvent) => void) => void
}

let sseChannelSingleton: SseChannelManager | null = null

export function useSseChannel (
  eventType: SseEventType,
  config: SseChannelConfig = {}
): SseChannelManager {
  const authStore = useAuthStore()
  const { $sse } = useNuxtApp()

  const isAuthenticated = computed(
    () => authStore.isAuthenticated && !!authStore.getToken && !!authStore.getUserId
  )

  if (!sseChannelSingleton) {
    const isConnected = ref(false)
    const connectionError = ref<Error | null>(null)
    const eventHandlers = new Map<SseEventType, Set<(event: MessageEvent) => void>>()

    const sseUrl = computed<string | undefined>(() => {
      if (!isAuthenticated.value) return undefined
      return ($sse as any).createAuthSseUrl('/api/notifications', authStore.getToken)
    })

    const {
      isConnected: sseIsConnected,
      error: sseConnectionError,
      reconnect: sseReconnect,
      addEventListener: sseAddEventListener,
      removeEventListener: sseRemoveEventListener,
      disconnect: sseDisconnect
    } = useSse(sseUrl, 'notifications-channel', {
      immediate: false
    })

    watch(sseIsConnected, (connected) => {
      isConnected.value = connected
    })

    watch(sseConnectionError, (error) => {
      connectionError.value = error
    })

    const connect = (connectConfig?: SseChannelConfig): boolean => {
      if (!isAuthenticated.value) return false

      try {
        connectConfig?.onConnect?.()
        return sseReconnect()
      } catch (error) {
        console.error('Error connecting SSE channel:', error)
        connectConfig?.onError?.(error as Error)
        return false
      }
    }

    const disconnect = (): boolean => {
      try {
        eventHandlers.clear()
        return sseDisconnect()
      } catch (error) {
        console.error('Error disconnecting SSE channel:', error)
        return false
      }
    }

    const addEventListener = (
      eventType: SseEventType,
      handler: (event: MessageEvent) => void
    ): void => {
      if (!eventHandlers.has(eventType)) {
        eventHandlers.set(eventType, new Set())
      }
      eventHandlers.get(eventType)!.add(handler)
      sseAddEventListener(eventType, handler)
    }

    const removeEventListener = (
      eventType: SseEventType,
      handler: (event: MessageEvent) => void
    ): void => {
      if (eventHandlers.has(eventType)) {
        eventHandlers.get(eventType)!.delete(handler)
      }
      sseRemoveEventListener(eventType, handler)
    }

    watch(isAuthenticated, (newAuth, oldAuth) => {
      if (newAuth && !oldAuth) {
        connect(config)
      } else if (!newAuth && oldAuth) {
        disconnect()
      }
    })

    sseChannelSingleton = {
      isConnected,
      connectionError,
      connect,
      disconnect,
      addEventListener,
      removeEventListener
    }
  }

  return sseChannelSingleton
}
