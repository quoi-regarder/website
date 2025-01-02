// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,

  // Site settings
  site: {
    url: 'https://quoi-regarder.fr',
    name: 'Quoi Regarder?'
  },

  // Application metadata
  app: {
    head: {
      titleTemplate: 'Quoi Regarder? | %s',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1'
    }
  },

  modules: [
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/ui'
  ],

  // Environment variables
  runtimeConfig: {
    supabaseUrl: process.env.NUXT_SUPABASE_URL,
    supabaseAnonKey: process.env.NUXT_SUPABASE_ANON_KEY,
    supabaseServiceKey: process.env.NUXT_SUPABASE_SERVICE_KEY,
    tmdbApiKey: process.env.NUXT_TMDB_API_KEY,
    tmdbBaseUrl: process.env.NUXT_TMDB_BASE_URL || 'https://api.themoviedb.org/'
  },

  // Nitro configuration
  nitro: {
    imports: {
      dirs: ['types/**', 'utils/**']
    }
  },

  // Auto import configuration
  imports: {
    dirs: ['composables/**', 'types/**', 'utils/**']
  },

  // Internationalization
  i18n: {
    baseUrl: 'https://quoi-regarder.fr',
    locales: [
      {
        code: 'en-US',
        iso: 'en-US',
        name: 'English (US)',
        files: ['en-US/general.json', 'en-US/seo.json']
      },
      {
        code: 'fr-FR',
        iso: 'fr-FR',
        name: 'Français',
        files: ['fr-FR/general.json', 'fr-FR/seo.json']
      }
    ],
    defaultLocale: 'en-US',
    langDir: 'locales/',
    strategy: 'prefix',
    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      fallbackLocale: 'en-US'
    }
  },

  // Color mode configuration
  colorMode: {
    preference: 'system',
    fallback: 'system',
    storage: 'cookie'
  },

  // Supabase configuration
  supabase: {
    url: process.env.NUXT_SUPABASE_URL,
    key: process.env.NUXT_SUPABASE_ANON_KEY,
    serviceKey: process.env.NUXT_SUPABASE_SERVICE_KEY,

    redirect: false
  },

  compatibilityDate: '2024-12-29'
})
