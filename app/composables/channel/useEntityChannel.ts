interface EntityChannelConfig<TService, TStore> {
  service: () => TService
  store: () => TStore
  eventType: string
  dataKey: string
  fetchMethod: 'getFavorite' | 'getWatchlist'
  updateMethod: (store: TStore, data: any) => void
  resetMethod?: (store: TStore) => void
}

interface EntityChannelReturn {
  cleanup: () => void
  isActive: ComputedRef<boolean>
}

export function useEntityChannel<TService, TStore> (
  config: EntityChannelConfig<TService, TStore>
): EntityChannelReturn {
  const { service, store, eventType, fetchMethod, updateMethod, resetMethod } = config

  const entityService = service()
  const entityStore = store()
  const authStore = useAuthStore()
  const { subscribe } = useSseManager()

  let unsubscribeFunction: (() => void) | null = null
  const callback = ref<((data: any) => void) | null>(null)

  const onEntityUpdate = (data: any) => {
    updateMethod(entityStore, data)
  }

  const init = async () => {
    if (!authStore.isAuthenticated || unsubscribeFunction) return

    try {
      // Fetch initial data
      const response = await (entityService as any)[fetchMethod](authStore.getUserId)

      if (response.success) {
        updateMethod(entityStore, response.data)
      }

      // Subscribe to updates
      callback.value = onEntityUpdate
      unsubscribeFunction = subscribe(eventType, onEntityUpdate)
    } catch (error) {
      console.error(`Error initializing ${eventType}:`, error)
    }
  }

  const cleanup = () => {
    if (unsubscribeFunction) {
      // Use only the function returned by subscribe
      unsubscribeFunction()
      unsubscribeFunction = null
      callback.value = null

      // Reset store if method provided
      if (resetMethod) {
        resetMethod(entityStore)
      }
    }
  }

  const isActive = computed(() => !!unsubscribeFunction)

  // Auto-init if authenticated
  if (import.meta.client && authStore.isAuthenticated) {
    init()
  }

  // Watch auth changes
  watch(
    () => authStore.isAuthenticated,
    (newAuth, oldAuth) => {
      if (newAuth && !oldAuth) {
        init()
      } else if (!newAuth && oldAuth) {
        cleanup()
      }
    }
  )

  return {
    cleanup,
    isActive
  }
}

export function createFavoriteChannelConfig<TService, TStore> (
  service: () => TService,
  store: () => TStore,
  eventType: string,
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
  eventType: string,
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
        // For stores with separate watchlist categories
        ;(store as any).setToWatchIds(data.to_watch || [])
        ;(store as any).setWatchedIds(data.watched || [])
        if (typeof (store as any).setWatchingIds === 'function') {
          ;(store as any).setWatchingIds(data.watching || [])
        }
      } else {
        // For simple stores
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
