<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Emergencia Venezuela - Portal de Ayuda'
const description = 'Plataforma ligera y optimizada para reportar emergencias, víctimas y buscar familiares en Venezuela. Funciona con conexiones móviles lentas.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-highlighted text-lg">
          <span>🇻🇪</span>
          <span>SOS Venezuela</span>
          <span class="text-xs px-1.5 py-0.5 rounded bg-error text-white font-normal uppercase tracking-wider">Emergencia</span>
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator />

    <UFooter>
      <template #left>
        <p class="text-xs text-muted">
          Plataforma de emergencia colectiva no gubernamental. Carga optimizada para móviles. © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <div class="flex items-center gap-2">
          <UButton
            to="https://github.com/jochdev/venezuela-emergencia"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub"
            color="neutral"
            variant="ghost"
            size="sm"
          />
        </div>
      </template>
    </UFooter>
  </UApp>
</template>
