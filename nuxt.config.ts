// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    'nuxt-snackbar',
    '@nuxt/test-utils',
  ],

  devtools: { enabled: true },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Clover Map',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        {
          key: 'description',
          name: 'description',
          content: 'Boost your productivity with Clover Map, the innovative visual workflow management tool. Organize, track, and streamline your tasks with intuitive treemap visualizations. Simplify project management and achieve more, faster!',
        },
        {
          key: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: 'Clover Map',
        },
        {
          key: 'application-name',
          name: 'application-name',
          content: 'Clover Map',
        },
        {
          key: 'msapplication-TileColor',
          name: 'msapplication-TileColor',
        },
      ],
      link: [
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    },
  },

  sourcemap: {
    client: false,
    server: false,
  },

  compatibilityDate: '2024-07-04',

  nitro: {
    preset: process.env.NITRO_PRESET || 'cloudflare-pages',
    // Cloudflare-specific configuration
    rollupConfig: {
      external: ['oxc-parser'],
    },
  },

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      'cssnano':
        process.env.NODE_ENV === 'production'
          ? { preset: ['default', { discardComments: { removeAll: true } }] }
          : false,
    },
  },

  // https://eslint.nuxt.com
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },

  googleFonts: {
    families: {
      Nunito: true,
    },
  },

  pinia: {
    storesDirs: ['./app/composables/**'],
    autoImports: [
      'defineStore',
      'storeToRefs',
    ],
  },
})
