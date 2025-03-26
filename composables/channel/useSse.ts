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

// Singleton to manage SSE connections
const sseManager = {
  connections: new Map<string, SseConnection>(),
  handlers: new Map<string, Map<string, Set<(event: MessageEvent) => void>>>(),

  getConnection (key: string) {
    return this.connections.get(key)
  },

  setConnection (key: string, connection: SseConnection) {
    this.connections.set(key, connection)
  },

  getHandlers (key: string) {
    if (!this.handlers.has(key)) {
      this.handlers.set(key, new Map())
    }
    return this.handlers.get(key)!
  },

  addHandler (key: string, eventName: string, handler: (event: MessageEvent) => void) {
    const handlers = this.getHandlers(key)
    if (!handlers.has(eventName)) {
      handlers.set(eventName, new Set())
    }
    handlers.get(eventName)!.add(handler)
  },

  removeHandler (key: string, eventName: string, handler: (event: MessageEvent) => void) {
    const handlers = this.getHandlers(key)
    if (handlers.has(eventName)) {
      handlers.get(eventName)!.delete(handler)
    }
  }
}

export const useSse = (url: Ref<string | undefined>, key: string, options: SseOptions = {}) => {
  const { $sse } = useNuxtApp()
  const authStore = useAuthStore()
  const isConnected = ref(false)
  const error = ref<Error | null>(null)

  // Computed property to check auth status
  const isAuthenticated = computed(() => authStore.isAuthenticated && !!authStore.getToken)

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
      // Reuse existing connection if available
      const existingConnection = sseManager.getConnection(key)
      if (existingConnection) {
        isConnected.value = existingConnection.status.value === 'OPEN'
        return true
      }

      // Create new connection
      const connection = $sse.createSseConnection(key, url.value) as SseConnection
      if (!connection) {
        const authError = new Error('Failed to create SSE connection')
        error.value = authError
        options.onError?.(authError)
        return false
      }

      sseManager.setConnection(key, connection)

      // Setup watchers
      watch(
        connection.status,
        (newStatus) => {
          isConnected.value = newStatus === 'OPEN'
          if (newStatus === 'OPEN') {
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
    sseManager.addHandler(key, eventName, callback)
    const connection = sseManager.getConnection(key)
    if (connection?.eventSource.value) {
      connection.eventSource.value.addEventListener(eventName, callback)
    }
  }

  // Remove event listener
  const removeEventListener = (eventName: string, callback: (event: MessageEvent) => void) => {
    sseManager.removeHandler(key, eventName, callback)
    const connection = sseManager.getConnection(key)
    if (connection?.eventSource.value) {
      connection.eventSource.value.removeEventListener(eventName, callback)
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

  // Watch authentication changes
  watch(isAuthenticated, (newAuth, oldAuth) => {
    if (newAuth && !oldAuth && url.value) {
      connect()
    } else if (!newAuth && oldAuth) {
      disconnect()
    }
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
