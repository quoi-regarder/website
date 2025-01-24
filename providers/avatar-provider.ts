import type { ProviderGetImage } from '@nuxt/image'
import { joinURL } from 'ufo'

export const getImage: ProviderGetImage = (src) => {
  const runtimeConfig = useRuntimeConfig()

  if (src.startsWith('http')) {
    return {
      url: src
    }
  }

  return {
    url: joinURL(runtimeConfig.public.apiBaseUrl, '/api/avatars' + src)
  }
}
