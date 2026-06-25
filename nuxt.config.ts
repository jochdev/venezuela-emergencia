// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/supabase',
    '@nuxtjs/device',
    '@nuxtjs/seo'
  ],

  site: {
    url: 'https://emergencia.joch.dev',
    name: 'Red de Apoyo y Emergencia Ciudadana',
    description: 'Plataforma ciudadana independiente para el reporte de afectados, búsqueda de familiares y gestión de ayuda en tiempo real en Venezuela.',
    defaultLocale: 'es',
    trailingSlash: false
  },

  schemaOrg: {
    enabled: false
  },

  ogImage: {
    enabled: true
  },

  sitemap: {
    strictNuxtContentAds: true
  },

  devtools: {
    enabled: true
  },

  colorMode: {
    preference: 'light',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '-mode',
    storageKey: 'nuxt-color-mode'
  },
  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY
    }
  },
  supabase: {
    redirect: false
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
