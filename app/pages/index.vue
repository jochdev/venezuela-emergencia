<script setup lang="ts">
import { ref } from 'vue'
import type { TabsItem } from '@nuxt/ui'

const tabItems = ref<TabsItem[]>([
  {
    label: 'Reportar Emergencia',
    icon: 'i-lucide-alert-triangle',
    value: 'reporte'
  },
  {
    label: 'Buscar Familiar',
    icon: 'i-lucide-users',
    value: 'busqueda'
  },
  {
    label: 'Monitoreo / Reportes',
    icon: 'i-lucide-list',
    value: 'lista'
  }
])

const activeTab = ref('reporte')
const listaRef = ref<any>(null)

const onReporteSuccess = () => {
  // Cuando se reporte exitosamente, refrescar la lista de fondo y cambiar a la pestaña lista si es deseado
  if (listaRef.value) {
    listaRef.value.refresh()
  }
}

const onBusquedaSuccess = () => {
  if (listaRef.value) {
    listaRef.value.refresh()
  }
}
</script>

<template>
  <div class="py-6 px-4 max-w-7xl mx-auto space-y-8">
    <!-- Hero / Header de Emergencia -->
    <div class="text-center space-y-3 py-6 border-b border-neutral-800">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/15 text-error text-xs font-semibold uppercase tracking-wider animate-pulse border border-error/20">
        <span class="size-2 rounded-full bg-error"></span>
        Alerta de Emergencia Activa
      </div>
      <h1 class="text-3xl md:text-5xl font-extrabold text-highlighted tracking-tight">
        Apoyo Colectivo - Emergencia Centro-Norte
      </h1>
      <p class="text-sm md:text-base text-muted max-w-2xl mx-auto">
        Canal de comunicación directo y ligero para reportar situaciones de riesgo, registrar personas afectadas y publicar solicitudes de búsqueda de familiares. Diseñado para cargar rápido en conexiones móviles inestables.
      </p>
    </div>

    <!-- Navegación por Pestañas -->
    <div class="space-y-6">
      <UTabs
        v-model="activeTab"
        :items="tabItems"
        color="error"
        variant="pill"
        size="lg"
        class="w-full max-w-2xl mx-auto"
      >
        <template #content="{ item }">
          <div class="mt-6">
            <Transition name="fade" mode="out-in">
              <div v-if="item.value === 'reporte'">
                <FormReporte @success="onReporteSuccess" />
              </div>
              <div v-else-if="item.value === 'busqueda'">
                <FormBusqueda @success="onBusquedaSuccess" />
              </div>
              <div v-else-if="item.value === 'lista'">
                <ListaReportes ref="listaRef" />
              </div>
            </Transition>
          </div>
        </template>
      </UTabs>
    </div>

    <!-- Consejos de Conectividad y Números de Emergencia -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-neutral-900">
      <div class="p-4 bg-neutral-950 rounded-xl border border-neutral-900 space-y-2">
        <h4 class="font-bold text-highlighted flex items-center gap-1.5 text-sm">
          <UIcon name="i-lucide-wifi-off" class="text-warning" />
          Consejos para Conexiones Débiles
        </h4>
        <ul class="text-xs text-muted list-disc list-inside space-y-1">
          <li>Si no carga, desactiva la descarga de imágenes en tu navegador.</li>
          <li>Usa el GPS del teléfono con el botón nativo, es más rápido que escribir.</li>
          <li>Mantén el brillo del teléfono bajo para conservar batería.</li>
        </ul>
      </div>

      <div class="p-4 bg-neutral-950 rounded-xl border border-neutral-900 space-y-2">
        <h4 class="font-bold text-highlighted flex items-center gap-1.5 text-sm">
          <UIcon name="i-lucide-phone" class="text-success" />
          Números de Contacto Críticos
        </h4>
        <div class="grid grid-cols-2 gap-2 text-xs text-muted">
          <div>📞 Emergencias Nacionales: <strong>911</strong></div>
          <div>📞 Bomberos: <strong>0212-5422222</strong></div>
          <div>📞 Protección Civil: <strong>0800-7248454</strong></div>
          <div>📞 Cruz Roja: <strong>0212-5782187</strong></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
