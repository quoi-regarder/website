export default defineNuxtPlugin(() => {
  // Store SSE connections
  const sseConnections = ref(new Map())
  const authStore = useAuthStore()

  // Check authentication
  const checkAuth = () => {
    if (!authStore.isAuthenticated || !authStore.getToken) {
      console.warn('SSE: Authentication required')
      return false
    }
    return true
  }

  // Get existing SSE connection
  const getExistingConnection = (key: string) => {
    return sseConnections.value.has(key) ? sseConnections.value.get(key) : null
  }

  // Create a new SSE connection
  const createSseConnection = (key: string, url: string) => {
    if (!checkAuth()) return null

    if (sseConnections.value.has(key)) {
      return sseConnections.value.get(key)
    }

    const connection = useEventSource(url, [], {
      immediate: true,
      autoReconnect: {
        retries: 20,
        delay: 5000,
        onFailed: () => {
          console.error(`SSE: Failed to connect after 20 retries for key: ${key}`)
          removeSseConnection(key)
        }
      }
    })

    // Watch for connection status
    watch(connection.status, (status) => {
      if (status === 'CLOSED') {
        console.warn(`SSE: Connection closed for key: ${key}`)
      }
    })

    sseConnections.value.set(key, connection)
    return connection
  }

  // Connect to SSE
  const connectSse = (key: string) => {
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
    if (connection?.eventSource.value) {
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
    if (!checkAuth()) return ''

    const runtimeConfig = useRuntimeConfig()
    const baseUrl = runtimeConfig.public.apiBaseUrl || ''
    return `${baseUrl}${baseEndpoint}?auth_token=${encodeURIComponent(token)}`
  }

  // Disconnect all connections
  const disconnectAll = () => {
    sseConnections.value.forEach((_, key) => disconnectSse(key))
  }

  // Watch for authentication state changes
  watch(
    () => authStore.isAuthenticated,
    (isAuthenticated) => {
      if (!isAuthenticated) disconnectAll()
    }
  )

  return {
    provide: {
      sse: {
        createSseConnection,
        getExistingConnection,
        connectSse,
        disconnectSse,
        removeSseConnection,
        createAuthSseUrl,
        disconnectAll
      }
    }
  }
})
