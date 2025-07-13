export default defineNuxtPlugin((nuxtApp) => {
  const localePath = useLocalePath()

  nuxtApp.hook('app:error', (error) => {
    console.error('App error:', error)
    if (error?.statusCode === 500 || error?.message?.includes('500') || error?.name === 'Error') {
      console.error('500 error detected, redirecting to homepage:', error)
      navigateTo(localePath('/'))
    }
  })

  nuxtApp.vueApp.config.errorHandler = (error) => {
    console.error('Vue error:', error)
    if (error instanceof Error && error.toString().includes('500')) {
      navigateTo(localePath('/'))
    }
  }
})
