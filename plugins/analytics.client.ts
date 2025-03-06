export default defineNuxtPlugin(() => {
  const cookieControl = useCookieControl()

  const init = () => {
    if (cookieControl.cookiesEnabledIds.value.includes('google-analytics')) {
      useScriptGoogleAnalytics({
        id: 'G-B4CCY2N977'
      })

      useScriptGoogleTagManager({
        id: 'GTM-W765273F'
      })
    }
  }

  return {
    provide: {
      analytics: {
        init: init
      }
    }
  }
})
