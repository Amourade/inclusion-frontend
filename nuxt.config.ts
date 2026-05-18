// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/styles/main.scss'],
  devtools: { enabled: true },
  modules: ['nuxt-directus'],
  runtimeConfig: {
    public: {
      directus: {
      }
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
  }
})