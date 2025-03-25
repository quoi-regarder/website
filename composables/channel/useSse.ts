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

// Store global event handlers
const globalEventHandlers = new Map<string, Map<string, Set<(event: MessageEvent) => void>>>()

export const useSse = (url: Ref<string | undefined>, key: string, options: SseOptions = {}) => {
  const { $sse } = useNuxtApp()
  const authStore = useAuthStore()
  const isConnected = ref(false)
  const error = ref<Error | null>(null)
  let connection: SseConnection | null = null

  // Computed property to check auth status
  const isAuthenticated = computed(() => authStore.isAuthenticated && !!authStore.getToken)

  // Setup event mapping for this instance
  const localEventHandlers = ref<Map<string, (event: MessageEvent) => void>>(new Map())

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
      // Check if connection already exists - if so, just set up listeners and return
      const existingConnection = $sse.getExistingConnection(key)
      if (existingConnection) {
        connection = existingConnection
        setupEventListeners()
        isConnected.value = connection.status.value === 'OPEN'
        return true
      }

      // Create new connection
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
    // Store in local handlers
    localEventHandlers.value.set(eventName, callback)

    // Initialize global handlers for this connection if needed
    if (!globalEventHandlers.has(key)) {
      globalEventHandlers.set(key, new Map())
    }
    const connectionHandlers = globalEventHandlers.get(key)!

    // Initialize handlers for this event if needed
    if (!connectionHandlers.has(eventName)) {
      connectionHandlers.set(eventName, new Set())
    }
    const eventHandlers = connectionHandlers.get(eventName)!

    // Add the callback to the set of handlers
    eventHandlers.add(callback)

    // Setup listeners if we have an active connection
    setupEventListeners()
  }

  // Remove event listener
  const removeEventListener = (eventName: string) => {
    const callback = localEventHandlers.value.get(eventName)
    if (callback && globalEventHandlers.has(key)) {
      const connectionHandlers = globalEventHandlers.get(key)!
      const eventHandlers = connectionHandlers.get(eventName)
      if (eventHandlers) {
        eventHandlers.delete(callback)
      }
    }
    localEventHandlers.value.delete(eventName)
  }

  // Setup event listeners
  const setupEventListeners = () => {
    if (!connection || !connection.eventSource.value) return

    const currentEventSource = connection.eventSource.value
    const connectionHandlers = globalEventHandlers.get(key)

    if (connectionHandlers) {
      connectionHandlers.forEach((handlers, eventName) => {
        const wrapper = (event: MessageEvent) => {
          handlers.forEach((handler) => handler(event))
        }
        // Remove existing listener if any
        currentEventSource.removeEventListener(eventName, wrapper)
        // Add new listener
        currentEventSource.addEventListener(eventName, wrapper)
      })
    }

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

  // Cleanup only event listeners on unmount
  onUnmounted(() => {
    // Remove only this instance's handlers
    localEventHandlers.value.forEach((callback, eventName) => {
      if (globalEventHandlers.has(key)) {
        const connectionHandlers = globalEventHandlers.get(key)!
        const eventHandlers = connectionHandlers.get(eventName)
        if (eventHandlers) {
          eventHandlers.delete(callback)
        }
      }
    })
    localEventHandlers.value.clear()
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
