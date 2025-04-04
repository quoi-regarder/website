import * as Sentry from '@sentry/nuxt'

const { sentryDsn } = useRuntimeConfig()

Sentry.init({
  dsn: sentryDsn as string,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false
})
