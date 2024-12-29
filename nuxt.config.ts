// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,

  modules: [
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
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
    tmdbApiKey: process.env.NUXT_TMDB_API_KEY
  },

  // Auto import configuration
  imports: {
    dirs: ['composables/**', 'types/**']
  },

  // Internationalization
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en-US.json' },
      { code: 'fr', iso: 'fr-FR', file: 'fr-FR.json' }
    ],
    defaultLocale: 'fr',
    langDir: 'locales/'
  },

  // Color mode configuration
  colorMode: {
    preference: 'light',
    fallback: 'light'
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
