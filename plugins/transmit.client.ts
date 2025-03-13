import { Transmit } from '@adonisjs/transmit-client'

export default defineNuxtPlugin(() => {
  // const runtimeConfig = useRuntimeConfig()

  // const transmit = new Transmit({
  //   baseUrl: runtimeConfig.public.apiBaseUrl,
  //   beforeSubscribe: (request) => {
  //     const token = useAuthStore().getToken

  //     if (token) {
  //       request.headers.append('Authorization', `Bearer ${token}`)
  //     }

  //     return request
  //   }
  // })

  return {
    // provide: {
    //   transmit: transmit
    // }
  }
})
