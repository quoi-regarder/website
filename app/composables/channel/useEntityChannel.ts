interface EntityChannelConfig<TService, TStore> {
  service: () => TService
  store: () => TStore
  eventType: SseEventType
  dataKey: string
  connectionKey?: string
  fetchMethod: 'getFavorite' | 'getWatchlist'
  updateMethod: (store: TStore, data: any) => void
  resetMethod: (store: TStore) => void
}

interface ChannelData {
  [key: string]: any[]
}

interface EntityChannelReturn {
  isConnected: Ref<boolean>
  connectionError: Ref<Error | null>
  isAuthenticated: ComputedRef<boolean>
  reconnect: () => Promise<boolean>
  disconnect: () => boolean
}

export function useEntityChannel<TService, TStore> (
  config: EntityChannelConfig<TService, TStore>
): EntityChannelReturn {
  const { service, store, eventType, dataKey, fetchMethod, updateMethod, resetMethod } = config

  const entityService = service()
  const entityStore = store()
  const authStore = useAuthStore()

  const isAuthenticated = computed(
    () => authStore.isAuthenticated && !!authStore.getToken && !!authStore.getUserId
  )

  const {
    isConnected,
    connectionError,
    connect: sseConnect,
    disconnect: sseDisconnect,
    addEventListener,
    removeEventListener
  } = useSseChannel(eventType)

  const onEntityUpdate = (event: MessageEvent) => {
    try {
      const data: ChannelData = JSON.parse(event.data)
      updateMethod(entityStore, data)
    } catch (error) {
      console.error(`Error parsing ${dataKey} update:`, error)
    }
  }

  const fetchEntityData = async () => {
    try {
      const response = await (entityService as any)[fetchMethod](authStore.getUserId)

      if (!response.success) {
        console.error(`Failed to fetch ${dataKey}.`)
        return
      }

      updateMethod(entityStore, response.data)
    } catch (error) {
      console.error(`Error fetching ${dataKey}:`, error)
    }
  }

  const connectChannel = async (): Promise<boolean> => {
    if (!isAuthenticated.value) return false

    try {
      return sseConnect({
        onConnect: async () => {
          await fetchEntityData()
          addEventListener(eventType, onEntityUpdate)
        },
        onError: (error) => {
          console.error(`Error in ${dataKey} channel:`, error)
        }
      })
    } catch (error) {
      console.error(`Error connecting ${dataKey} channel:`, error)
      return false
    }
  }

  const disconnectChannel = () => {
    try {
      removeEventListener(eventType, onEntityUpdate)
      resetMethod(entityStore)
      return sseDisconnect()
    } catch (error) {
      console.error(`Error disconnecting ${dataKey} channel:`, error)
      return false
    }
  }

  onMounted(() => {
    if (isAuthenticated.value) {
      connectChannel()
    }
  })

  watch(isAuthenticated, async (newAuthStatus, oldAuthStatus) => {
    if (newAuthStatus && !oldAuthStatus) {
      await connectChannel()
    } else if (!newAuthStatus && oldAuthStatus) {
      disconnectChannel()
    }
  })

  return {
    isConnected,
    connectionError,
    isAuthenticated,
    reconnect: connectChannel,
    disconnect: disconnectChannel
  }
}

export function createFavoriteChannelConfig<TService, TStore> (
  service: () => TService,
  store: () => TStore,
  eventType: SseEventType,
  dataKey: string
): EntityChannelConfig<TService, TStore> {
  return {
    service,
    store,
    eventType,
    dataKey,
    fetchMethod: 'getFavorite',
    updateMethod: (store: TStore, data: any) => {
      ;(store as any).setIds(data[dataKey] || [])
    },
    resetMethod: (store: TStore) => {
      ;(store as any).reset()
    }
  }
}

export function createWatchlistChannelConfig<TService, TStore> (
  service: () => TService,
  store: () => TStore,
  eventType: SseEventType,
  dataKey: string
): EntityChannelConfig<TService, TStore> {
  return {
    service,
    store,
    eventType,
    dataKey,
    fetchMethod: 'getWatchlist',
    updateMethod: (store: TStore, data: any) => {
      if (typeof (store as any).setToWatchIds === 'function') {
        ;(store as any).setToWatchIds(data.to_watch || [])
        ;(store as any).setWatchedIds(data.watched || [])
        if (typeof (store as any).setWatchingIds === 'function') {
          ;(store as any).setWatchingIds(data.watching || [])
        }
      } else {
        ;(store as any).setIds(data[dataKey] || [])
      }
    },
    resetMethod: (store: TStore) => {
      if (typeof (store as any).setToWatchIds === 'function') {
        ;(store as any).setToWatchIds([])
        ;(store as any).setWatchedIds([])
        if (typeof (store as any).setWatchingIds === 'function') {
          ;(store as any).setWatchingIds([])
        }
      } else {
        ;(store as any).reset()
      }
    }
  }
}
