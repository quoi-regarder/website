// composables/useSseManager.ts

// Global state
let eventSource: EventSource | null = null
const listeners = new Map<string, Set<(data: any) => void>>()
const eventListeners = new Map<string, EventListener>()

// Connection state
const connectionState = ref<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')
const error = ref<Error | null>(null)

// Reconnection config
const MAX_RETRY_ATTEMPTS = 5
const BASE_RETRY_DELAY = 1000
let retryCount = 0
let reconnectTimer: NodeJS.Timeout | null = null

export const useSseManager = () => {
  const authStore = useAuthStore()

  const scheduleReconnect = () => {
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      connectionState.value = 'error'
      error.value = new Error(`Max retry attempts (${MAX_RETRY_ATTEMPTS}) reached`)
      return
    }

    const delay = BASE_RETRY_DELAY * Math.pow(2, retryCount++)
    reconnectTimer = setTimeout(() => {
      if (listeners.size > 0) connect()
    }, delay)
  }

  const clearReconnectTimer = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  const connect = () => {
    if (!authStore.isAuthenticated) {
      connectionState.value = 'disconnected'
      return
    }

    if (eventSource?.readyState === EventSource.OPEN) {
      connectionState.value = 'connected'
      return
    }

    // Close existing connection
    if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
      eventSource.close()
    }

    clearReconnectTimer()
    connectionState.value = 'connecting'

    const runtimeConfig = useRuntimeConfig()
    const url = `${runtimeConfig.public.apiBaseUrl}/api/notifications?auth_token=${authStore.getToken}`

    eventSource = new EventSource(url)

    eventSource.onopen = () => {
      connectionState.value = 'connected'
      error.value = null
      retryCount = 0

      // Setup all pending event listeners
      eventListeners.forEach((listener, eventType) => {
        eventSource!.addEventListener(eventType, listener)
      })
    }

    eventSource.onerror = () => {
      if (eventSource?.readyState === EventSource.CLOSED) {
        connectionState.value = 'error'
        error.value = new Error('Connection lost')

        if (listeners.size > 0) {
          scheduleReconnect()
        }
      }
    }
  }

  const subscribe = (eventType: string, callback: (data: any) => void) => {
    // Add callback
    if (!listeners.has(eventType)) {
      listeners.set(eventType, new Set())
    }
    listeners.get(eventType)!.add(callback)

    // Register event listener (once per event type)
    if (!eventListeners.has(eventType)) {
      const eventListener = (event: Event) => {
        try {
          const data = JSON.parse((event as MessageEvent).data)
          listeners.get(eventType)?.forEach((cb) => cb(data))
        } catch (error) {
          console.error(`Error parsing ${eventType}:`, error)
        }
      }

      eventListeners.set(eventType, eventListener)

      // Add to EventSource if connected
      if (eventSource?.readyState === EventSource.OPEN) {
        eventSource.addEventListener(eventType, eventListener)
      }
    }

    // Ensure connection
    if (!eventSource || eventSource.readyState !== EventSource.OPEN) {
      connect()
    }

    // Return cleanup function
    return () => {
      const callbacks = listeners.get(eventType)
      if (callbacks) {
        callbacks.delete(callback)

        // Remove event type if no more callbacks
        if (callbacks.size === 0) {
          listeners.delete(eventType)

          const eventListener = eventListeners.get(eventType)
          if (eventListener && eventSource) {
            eventSource.removeEventListener(eventType, eventListener)
          }
          eventListeners.delete(eventType)
        }
      }

      // Disconnect if no more listeners
      if (listeners.size === 0) {
        disconnect()
      }
    }
  }

  const disconnect = () => {
    clearReconnectTimer()

    if (eventSource) {
      eventSource.close()
      eventSource = null
    }

    listeners.clear()
    eventListeners.clear()
    retryCount = 0
    connectionState.value = 'disconnected'
    error.value = null
  }

  const reconnect = () => {
    retryCount = 0
    disconnect()
    if (listeners.size > 0) connect()
  }

  // Cleanup on page unload
  if (import.meta.client) {
    window.addEventListener('beforeunload', disconnect)
  }

  return {
    subscribe,
    disconnect,
    reconnect,
    connectionState: readonly(connectionState),
    error: readonly(error),
    getActiveEvents: () => Array.from(listeners.keys()),
    getListenerCount: (eventType?: string) =>
      eventType
        ? listeners.get(eventType)?.size || 0
        : Array.from(listeners.values()).reduce((total, set) => total + set.size, 0)
  }
}
