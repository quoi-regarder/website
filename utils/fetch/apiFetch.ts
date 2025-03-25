export async function apiFetch<ApiResponse> (
  path: string,
  {
    params = {},
    method = 'GET',
    body = {},
    contentType = 'application/json'
  }: {
    params?: Record<string, any>
    method?: 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE'
    body?: Record<string, any> | FormData
    contentType?: string
  } = {}
): Promise<ApiResponse> {
  const runtimeConfig = useRuntimeConfig()
  const { $i18n } = useNuxtApp()

  const apiPrefix = '/api'
  const apiPath = `${apiPrefix}${path}`

  const manager = new QueryParamsManager(apiPath, runtimeConfig.public.apiBaseUrl)

  Object.entries(params).forEach(([key, value]) => {
    manager.add(key, value)
  })

  const headers: Record<string, string> = {
    Authorization: useAuthStore().getToken ? `Bearer ${useAuthStore().getToken}` : ''
  }

  if (!(body instanceof FormData)) {
    headers['Content-Type'] = contentType
  }

  const response = await fetch(manager.toString(), {
    method,
    headers,
    credentials: 'include',
    body: method !== 'GET' ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined
  })

  let data: ApiResponse
  try {
    const text = await response.text()
    data = text ? JSON.parse(text) : ({} as ApiResponse)
  } catch (error) {
    console.error('Failed to parse response:', error)
    data = {} as ApiResponse
  }

  // Handle expired token
  if (
    useAuthStore().getToken &&
    !data.success &&
    data.error?.status === ErrorStatus.JWT_TOKEN_EXPIRED
  ) {
    useAuthStore().resetAuth()
    useNotifications().error(
      $i18n.t('common.toasts.title.error'),
      $i18n.t('common.toasts.errors.session.expired')
    )
    navigateTo('/auth/login')
  }

  // Handle rate limit
  if (response.status === 429) {
    useNotifications().error(
      $i18n.t('common.toasts.title.error'),
      $i18n.t('common.toasts.errors.rate.limit')
    )
  }

  return data
}
