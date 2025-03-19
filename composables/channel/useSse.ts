interface SseOptions {
  immediate?: boolean
  autoReconnect?:
    | boolean
    | {
        retries: number
        delay: number
      }
  onOpen?: () => void
  onError?: (error: Error) => void
  onMessage?: (event: MessageEvent) => void
}

interface SseConnection {
  status: Ref<string>
  error: Ref<Error | null>
  eventSource: Ref<EventSource | null>
}

export const useSse = (url: Ref<string | undefined>, key: string, options: SseOptions = {}) => {
  const { $sse } = useNuxtApp()
  const authStore = useAuthStore()
  const isConnected = ref(false)
  const error = ref<Error | null>(null)
  let connection: SseConnection | null = null

  // Computed property to check auth status
  const isAuthenticated = computed(() => authStore.isAuthenticated && !!authStore.getToken)

  // Setup event mapping
  const eventHandlers = ref<Map<string, (event: MessageEvent) => void>>(new Map())

  // Connect to SSE
  const connect = () => {
    if (!url.value) return false

    // Check authentication
    if (!isAuthenticated.value) {
      const authError = new Error('Authentication required for SSE connection')
      error.value = authError
      options.onError?.(authError)
      return false
    }

    try {
      // Create or get connection
      connection = $sse.createSseConnection(key, url.value) as SseConnection

      // Handle null connection (happens if auth check failed in plugin)
      if (!connection) {
        const authError = new Error('Failed to create SSE connection, authentication required')
        error.value = authError
        options.onError?.(authError)
        return false
      }

      // Setup watchers
      watch(
        connection.status,
        (newStatus) => {
          isConnected.value = newStatus === 'OPEN'

          if (newStatus === 'OPEN') {
            setupEventListeners()
            options.onOpen?.()
          }
        },
        { immediate: true }
      )

      watch(
        connection.error,
        (newError) => {
          error.value = newError
          if (newError) {
            options.onError?.(newError)
          }
        },
        { immediate: true }
      )

      // Connect
      $sse.connectSse(key)

      return true
    } catch (err) {
      error.value = err as Error
      options.onError?.(err as Error)
      return false
    }
  }

  // Add event listener
  const addEventListener = (eventName: string, callback: (event: MessageEvent) => void) => {
    eventHandlers.value.set(eventName, callback)
    setupEventListeners()
  }

  // Remove event listener
  const removeEventListener = (eventName: string) => {
    eventHandlers.value.delete(eventName)
    setupEventListeners()
  }

  // Setup event listeners
  const setupEventListeners = () => {
    if (!connection || !connection.eventSource.value) return

    // Get all current event names from the event source
    const currentEventSource = connection.eventSource.value

    // First remove all previous handlers
    eventHandlers.value.forEach((_, eventName) => {
      currentEventSource.removeEventListener(eventName, (e: MessageEvent) => {
        const handler = eventHandlers.value.get(eventName)
        if (handler) handler(e)
      })
    })

    // Then add current handlers
    eventHandlers.value.forEach((handler, eventName) => {
      currentEventSource.addEventListener(eventName, handler)
    })

    // Add message handler if provided
    if (options.onMessage) {
      currentEventSource.onmessage = options.onMessage
    }
  }

  // Disconnect
  const disconnect = () => {
    return $sse.disconnectSse(key)
  }

  // Reconnect
  const reconnect = () => {
    disconnect()
    return connect()
  }

  // Connect immediately if specified and authenticated
  if (options.immediate !== false && url.value && isAuthenticated.value) {
    connect()
  }

  // Watch URL changes
  watch(url, (newUrl, oldUrl) => {
    if (newUrl !== oldUrl && newUrl && isAuthenticated.value) {
      reconnect()
    }
  })

  // Watch authentication changes
  watch(isAuthenticated, (newAuth, oldAuth) => {
    if (newAuth && !oldAuth && url.value) {
      // Reconnect when user becomes authenticated
      reconnect()
    } else if (!newAuth && oldAuth) {
      // Disconnect when user is no longer authenticated
      disconnect()
    }
  })

  // Cleanup on unmount
  onUnmounted(() => {
    $sse.removeSseConnection(key)
  })

  return {
    isConnected,
    error,
    connect,
    disconnect,
    reconnect,
    addEventListener,
    removeEventListener
  }
}
