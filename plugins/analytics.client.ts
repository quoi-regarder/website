export default defineNuxtPlugin(() => {
  const { cookiesEnabledIds } = useCookieControl()
  const consentGiven = computed(() => cookiesEnabledIds.value?.includes('google-analytics'))

  const { proxy: ga } = useScriptGoogleAnalytics({
    id: 'G-B4CCY2N977',
    consent: 'denied',
    scriptLoadedTrigger: () => consentGiven.value
  })

  const { proxy: gtm } = useScriptGoogleTagManager({
    id: 'GTM-W765273F',
    consent: 'denied',
    scriptLoadedTrigger: () => consentGiven.value
  })

  watch(
    consentGiven,
    (newValue) => {
      if (newValue) {
        ga.consent = 'granted'
        gtm.consent = 'granted'
      } else {
        ga.consent = 'denied'
        gtm.consent = 'denied'
      }
    },
    { immediate: true }
  )
})
