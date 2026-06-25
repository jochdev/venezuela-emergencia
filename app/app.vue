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
  ogImage: '/og-emergencia.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <header class="bg-white py-6 px-4 sm:px-6">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <!-- Logo y Subtítulo -->
        <div>
          <NuxtLink to="/" class="text-xl tracking-tight">
            <span class="font-bold text-[#e15a2b]">Emergencia</span><span
              class="font-semibold text-neutral-800">.joch.dev</span>
          </NuxtLink>
          <p class="text-xs text-neutral-500 mt-1">
            Iniciativa Ciudadana de Apoyo - Sismo 2026
          </p>
        </div>

        <!-- Powered by Jochdev -->
        <div class="text-xs text-neutral-500 self-start sm:self-center font-mono">
          Powered by Jochdev
        </div>
      </div>
    </header>

    <UMain class="bg-white min-h-[calc(100vh-140px)]">
      <NuxtPage />
    </UMain>


    <footer class="border-t border-neutral-100 bg-white py-8 px-4 mt-8">
      <div class="max-w-7xl mx-auto space-y-4">
        <!-- Declaración de la iniciativa -->
        <p class="text-xs text-neutral-500 leading-relaxed max-w-4xl text-center mx-auto">
          Esta es una iniciativa ciudadana independiente de código abierto para facilitar la localización de personas y
          coordinar apoyo. Los datos recopilados se pondrán a disposición de los cuerpos de rescate oficiales
          (Protección Civil, Bomberos) para agilizar las labores de búsqueda y rescate.
        </p>

        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-neutral-500 pt-4 border-t border-neutral-100">
          <!-- Enlaces de políticas y código -->
          <div class="flex flex-wrap gap-2 items-center">
            <UButton label="Política de Privacidad y Manejo de Datos" to="/privacidad" variant="link" color="neutral"
              size="xs" class="p-0 text-neutral-500 hover:text-neutral-900 cursor-pointer" />
            <span>|</span>
            <UButton label="Ver Código Fuente en GitHub" to="https://github.com/jochdev/venezuela-emergencia"
              target="_blank" variant="link" color="neutral" size="xs"
              class="p-0 text-neutral-500 hover:text-neutral-900 cursor-pointer" />
          </div>

          <!-- Créditos -->
          <div class="md:text-right">
            <p>
              Desarrollado de forma abierta y solidaria por <a href="https://joch.dev" target="_blank"
                class="hover:underline text-neutral-700">joch.dev</a>.
            </p>
            <p class="text-[10px] text-neutral-400 mt-1">
              La base de datos se destruirá una vez superada la emergencia.
            </p>
          </div>
        </div>
      </div>
    </footer>
  </UApp>
</template>
