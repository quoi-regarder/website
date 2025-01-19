// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,

  site: {
    name: 'Quoi regarder ?',
    url: 'https://quoi-regarder.fr'
  },

  // Application metadata
  app: {
    head: {
      titleTemplate: '%s - Quoi regarder ?',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/android-chrome-512x512.png' },
        { rel: 'mask-icon', color: '#ffffff', href: '/safari-pinned-tab.svg' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxt/eslint',
    '@nuxthub/core',
    '@nuxt/scripts',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],

  css: ['/assets/css/main.css'],

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
      dirs: ['types/**', 'utils/**', 'store/**']
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
        code: 'us',
        iso: 'en-US',
        language: 'en-US',
        name: 'English (US)',
        files: ['us/general.json', 'us/seo.json', 'us/filters.json', 'us/regulation.json']
      },
      {
        code: 'fr',
        iso: 'fr-FR',
        language: 'fr-FR',
        name: 'Français',
        files: ['fr/general.json', 'fr/seo.json', 'fr/filters.json', 'fr/regulation.json']
      }
    ],
    defaultLocale: 'fr',
    langDir: 'locales/',
    strategy: 'prefix_except_default',
    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      fallbackLocale: 'fr'
    }
  },

  // SEO configuration
  robots: {
    disallow: ['/regulation/**']
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

  // NuxtHub configuration
  hub: {
    analytics: true,
    cache: true,
    kv: true
  },

  // Google analytics configuration
  $production: {
    scripts: {
      registry: {
        googleAnalytics: {
          id: 'G-B4CCY2N977'
        },
        googleTagManager: {
          id: 'GTM-W765273F'
        }
      }
    }
  },

  compatibilityDate: '2025-01-16'
})
