export default defineNuxtPlugin(() => {
  // Store SSE connections
  const sseConnections = ref(new Map())

  // Check authentication
  const checkAuth = () => {
    // Use the auth store to check if the user is authenticated
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated || !authStore.getToken) {
      console.warn('SSE: Authentication required')
      return false
    }
    return true
  }

  // Create a new SSE connection
  const createSseConnection = (key: string, url: string) => {
    // Check authentication first
    if (!checkAuth()) return null

    // If connection already exists, return it
    if (sseConnections.value.has(key)) {
      return sseConnections.value.get(key)
    }

    // Create new connection
    const connection = useEventSource(url, [], {
      immediate: false,
      autoReconnect: {
        retries: 5,
        delay: 5000
      }
    })

    // Store connection by key
    sseConnections.value.set(key, connection)

    return connection
  }

  // Connect to SSE
  const connectSse = (key: string) => {
    // Check authentication first
    if (!checkAuth()) return false

    const connection = sseConnections.value.get(key)
    if (connection) {
      connection.open()
      return true
    }
    return false
  }

  // Disconnect from SSE
  const disconnectSse = (key: string) => {
    const connection = sseConnections.value.get(key)
    if (connection && connection.eventSource.value) {
      connection.eventSource.value.close()
      return true
    }
    return false
  }

  // Remove SSE connection
  const removeSseConnection = (key: string) => {
    disconnectSse(key)
    return sseConnections.value.delete(key)
  }

  // Create authentication URL helper
  const createAuthSseUrl = (baseEndpoint: string, token: string) => {
    // Check authentication first
    if (!checkAuth()) return ''

    const runtimeConfig = useRuntimeConfig()
    const baseUrl = runtimeConfig.public.apiBaseUrl || ''
    return `${baseUrl}${baseEndpoint}?auth_token=${encodeURIComponent(token)}`
  }

  // Disconnect all connections
  const disconnectAll = () => {
    sseConnections.value.forEach((_, key) => {
      disconnectSse(key)
    })
  }

  // Watch for authentication state changes
  const authStore = useAuthStore()
  watch(
    () => authStore.isAuthenticated,
    (isAuthenticated) => {
      if (!isAuthenticated) {
        // Disconnect all SSE connections when user logs out
        disconnectAll()
      }
    }
  )

  return {
    provide: {
      sse: {
        createSseConnection,
        connectSse,
        disconnectSse,
        removeSseConnection,
        createAuthSseUrl,
        disconnectAll
      }
    }
  }
})
