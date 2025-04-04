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
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxt/eslint',
    '@nuxt/scripts',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/content',
    '@dargmuesli/nuxt-cookie-control',
    '@sentry/nuxt/module'
  ],

  css: ['/assets/css/main.css'],

  // Environment variables
  runtimeConfig: {
    tmdbApiKey: process.env.NUXT_TMDB_API_KEY,
    tmdbBaseUrl: process.env.NUXT_TMDB_BASE_URL,
    sentryDsn: process.env.NUXT_SENTRY_DSN,
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      maintenance: process.env.NUXT_PUBLIC_MAINTENANCE
    }
  },

  // Nitro configuration
  nitro: {
    imports: {
      dirs: ['types/**', 'utils/**']
    }
  },

  // Auto import configuration
  imports: {
    dirs: ['composables/**', 'types/**', 'utils/**', 'models/**']
  },

  // Internationalization
  i18n: {
    bundle: {
      optimizeTranslationDirective: false
    },
    baseUrl: 'https://quoi-regarder.fr',
    locales: [
      {
        code: 'us',
        iso: 'en-US',
        language: 'en-US',
        name: 'English',
        files: ['us/general.json', 'us/seo.json', 'us/filters.json']
      },
      {
        code: 'fr',
        iso: 'fr-FR',
        language: 'fr-FR',
        name: 'Français',
        files: ['fr/general.json', 'fr/seo.json', 'fr/filters.json']
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
    disallow: ['/regulation/**', '/maintenance']
  },

  // Color mode configuration
  colorMode: {
    preference: 'system',
    fallback: 'system',
    storage: 'cookie'
  },

  // Images configuration
  image: {
    providers: {
      avatarProvider: {
        name: 'avatarProvider',
        provider: '~/providers/avatar-provider.ts'
      }
    }
  },

  // Scripts configuration
  scripts: {
    registry: {
      googleAnalytics: {
        id: 'G-B4CCY2N977'
      },
      googleTagManager: {
        id: 'GTM-W765273F'
      }
    }
  },

  // Cookie control configuration
  cookieControl: {
    colors: {
      barBackground: '#000',
      barButtonColor: '#fff',
      barButtonBackground: '#444',
      barButtonHoverBackground: '#666',
      checkboxActiveBackground: '#00A34A',
      modalButtonColor: '#fff',
      modalTextColor: '#314158',
      modalButtonBackground: '#000',
      controlButtonIconColor: '#000',
      controlButtonBackground: '#fff'
    },
    locales: ['fr', 'en'],
    isCookieIdVisible: false,
    isControlButtonEnabled: false,
    cookies: {
      necessary: [
        {
          id: 'necessary',
          name: {
            fr: 'Cookies essentiels',
            en: 'Essential cookies'
          },
          description: {
            fr: 'Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.',
            en: 'These cookies are necessary for the website to function and cannot be switched off.'
          },
          links: {
            'https://quoi-regarder.fr/regulation/cookies': 'Politique de cookies'
          }
        }
      ],
      optional: [
        {
          id: 'google-analytics',
          name: {
            fr: 'Analytique',
            en: 'Analytics'
          },
          description: {
            fr: 'Ces cookies nous permettent d\'analyser l\'utilisation du site pour mesurer et améliorer les performances.',
            en: 'These cookies allow us to analyze site usage to measure and improve performance.'
          },
          links: {
            'https://policies.google.com/privacy': 'Politique de confidentialité Google',
            'https://quoi-regarder.fr/regulation/privacy': 'Politique de confidentialité'
          }
        }
      ]
    }
  },

  compatibilityDate: '2025-01-16',

  sentry: {
    sourceMapsUploadOptions: {
      org: 'quoi-regarder',
      project: 'frontend'
    }
  },

  sourcemap: {
    client: 'hidden'
  }
})
