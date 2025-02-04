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
    body: method !== 'GET' ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined
  })

  if (response.status === 429) {
    useNotifications().error(
      $i18n.t('common.toasts.title.error'),
      $i18n.t('common.toasts.errors.rateLimit')
    )
  }

  const data: ApiResponse = await response.json()
  return data
}
