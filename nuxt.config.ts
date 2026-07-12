// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/styles/main.scss'],
  devtools: { enabled: true },
  modules: ['nuxt-directus'/* , '@nuxtjs/i18n' */, '@nuxtjs/sitemap', '@nuxtjs/robots'],
  // Absolute base URL used by @nuxtjs/sitemap (for <loc>) and @nuxtjs/robots
  // (for the Sitemap: line). Required at build time by `nuxt generate`.
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || process.env.NUXT_PUBLIC_DOMAIN,
    name: process.env.NUXT_PUBLIC_SITE_NAME || process.env.NUXT_SITE_NAME
  },
  runtimeConfig: {
    public: {
      directus: {
      },
      domain: process.env.NUXT_PUBLIC_DOMAIN
    }
  },
  /* i18n: {
    locales: [
      { code: 'en', language: 'en-US' },
      { code: 'fr', language: 'fr-FR' }
    ],
    defaultLocale: 'fr',
    strategy: 'no_prefix'
  }, */
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },
  app: {
    /* pageTransition: {name: 'page', mode: 'out-in'} */
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
      crawlLinks: true,
      // Seed routes: entry points the crawler starts from.
      // '/actualites/articles' lists every published article, so the
      // crawler discovers each /actualites/articles/{slug} page from there.
      routes: ['/', '/actualites/articles'],
      interval: 5,
      concurrency: 1
    }
  }
})