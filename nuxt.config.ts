// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/styles/main.scss'],
  devtools: { enabled: true },
  modules: ['nuxt-directus', '@nuxtjs/i18n'],
  runtimeConfig: {
    public: {
      directus: {
      },
      domain: process.env.NUXT_PUBLIC_CURRENT_DOMAIN
    }
  },
  i18n: {
    locales: [
      { code: 'en', language: 'en-US' },
      { code: 'fr', language: 'fr-FR' }
    ],
    defaultLocale: 'fr',
    strategy: 'no_prefix'
  },
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },
  app: {
    pageTransition: true
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/variables.scss" as *;'
        }
      }
    },
    server: {
      hmr: {
        protocol: undefined 
      },
      allowedHosts: ['inclusion.localhost.com', 'inclusion.antoinetheriault.com']
    }
  },
  nitro: {
    prerender: {
      interval: 200,
      concurrency: 1
    }
  }
})