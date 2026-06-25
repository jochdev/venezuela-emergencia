<script setup lang="ts">
import { ref, provide } from 'vue'
import type { ButtonProps } from '@nuxt/ui'
import { useUbicaciones } from '~/composables/useUbicaciones'
import FormReporte from '~/components/FormReporte.vue'
import FormBusqueda from '~/components/FormBusqueda.vue'
import CentrosAcopio from '~/components/CentrosAcopio.vue'
import VoluntariadoMedico from '~/components/VoluntariadoMedico.vue'

const { isMobile } = useDevice()

const { ubicaciones } = await useUbicaciones()
provide('ubicaciones', ubicaciones)

const modalCompartirAbierto = ref(false)

const compartirPlataforma = () => {
  modalCompartirAbierto.value = true
}

const links = ref<ButtonProps[]>([
  {
    label: 'Compartir Plataforma',
    color: 'primary',
    variant: 'subtle',
    icon: 'i-lucide-share-2',
    click: compartirPlataforma
  }
])

const slideoverAbierto = ref(false)
const componenteActivo = ref('')
const tituloSlideover = ref('')
const descripcionSlideover = ref('')

const abrirFormulario = (tipo: string) => {
  componenteActivo.value = tipo
  if (tipo === 'reporte') {
    tituloSlideover.value = 'Reportar Emergencia'
    descripcionSlideover.value = 'Ingresa los datos del afectado para coordinar ayuda prioritaria.'
  } else if (tipo === 'busqueda') {
    tituloSlideover.value = 'Buscar Familiar'
    descripcionSlideover.value = 'Consulta la base de datos de personas reportadas.'
  } else if (tipo === 'acopio') {
    tituloSlideover.value = 'Centros de Acopio'
    descripcionSlideover.value = 'Filtra y localiza puntos de recolección de insumos.'
  } else if (tipo === 'voluntariado') {
    tituloSlideover.value = 'Voluntariado Médico'
    descripcionSlideover.value = 'Regístrate si tienes experiencia en el área de salud.'
  }
  slideoverAbierto.value = true
}
const { data: reportesRaw } = await useAsyncData('conteo_reportes', async () => {
  try {
    const supabase = useSupabase()
    const { data } = await supabase.from('reportes_emergencias').select('estado_id')
    return data || []
  } catch (e) {
    console.error('Error al obtener conteo de reportes:', e)
    return []
  }
})

const estadisticasEstados = computed(() => {
  const listaUbicaciones = ubicaciones.value || []
  const conteos: Record<number, number> = {}

  // Contar reportes por estado
  if (reportesRaw.value) {
    reportesRaw.value.forEach((r: any) => {
      if (r.estado_id) {
        conteos[r.estado_id] = (conteos[r.estado_id] || 0) + 1
      }
    })
  }

  // Filtrar los estados que tienen reportes (o mostrar todos si se prefiere, aquí mostramos estados con > 0 reportes o un top de activos)
  return listaUbicaciones
    .map((est: any) => {
      const cantidad = conteos[est.id] || 0
      return {
        nombre: est.nombre,
        cantidad
      }
    })
    .filter((est: any) => est.cantidad > 0)
    .sort((a: any, b: any) => b.cantidad - a.cantidad)
})
</script>

<template>
  <div class="py-8 px-4 max-w-7xl mx-auto space-y-8 bg-white text-neutral-800">
    <!-- Hero / Header de Emergencia (UPageHero) -->
    <UPageHero title="Red de Apoyo y Emergencia Ciudadana"
      description="Iniciativa ciudadana independiente para el reporte de afectados, búsqueda de familiares y gestión de ayuda en tiempo real."
      :links="links" :class="isMobile ? 'py-3' : 'py-8'" />

    <!-- UMarquee: Estados y cantidad de reportes -->
    <div v-if="estadisticasEstados.length > 0" class="py-2 ">
      <UMarquee :overlay="false" class="py-1">
        <div v-for="est in estadisticasEstados" :key="est.nombre"
          class="flex items-center gap-2 px-6 font-semibold text-2xl text-neutral-700 font-mono">
          <span class="w-2.5 h-2.5 rounded-full bg-[#F94C10] animate-pulse"></span>
          <span>{{ est.nombre }}:</span>
          <span class="text-neutral-900 font-bold  px-2 py-0.5  ">{{ est.cantidad }} </span>
        </div>
      </UMarquee>
    </div>
    <div v-else
      class="py-2 bg-neutral-50 rounded-xl border border-neutral-100 overflow-hidden text-center text-xs font-mono text-neutral-500">
      📢 Sin reportes de emergencias activos registrados.
    </div>

    <!-- Grid de Tarjetas de Acciones Principales (UPageCard) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto py-4">
      <UPageCard title="Reportar Emergencia"
        description="Reporta víctimas, heridos o situaciones críticas en tiempo real." icon="i-lucide-alert-triangle"
        spotlight spotlight-color="primary"
        class="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        @click="abrirFormulario('reporte')" />

      <UPageCard title="Buscar Familiar"
        description="Busca personas y consulta estatus de salud registrados en el sistema." icon="i-lucide-search"
        spotlight spotlight-color="primary"
        class="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        @click="abrirFormulario('busqueda')" />

      <UPageCard title="Centros de Acopio"
        description="Encuentra o postula puntos de recolección y donativos de insumos." icon="i-lucide-package"
        spotlight spotlight-color="primary"
        class="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        @click="abrirFormulario('acopio')" />

      <UPageCard title="Voluntariado Médico"
        description="Regístrate como personal de salud o rescatista activo para apoyar." icon="i-lucide-ambulance"
        spotlight spotlight-color="primary"
        class="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        @click="abrirFormulario('voluntariado')" />
    </div>

    <!-- USlideover para Contener los Formularios Dinámicos -->
    <USlideover v-model:open="slideoverAbierto" :title="tituloSlideover" :description="descripcionSlideover"
      class="max-w-md w-full">
      <template #body>
        <div class="py-2 overflow-y-auto max-h-[85vh]">
          <FormReporte v-if="componenteActivo === 'reporte'" @success="slideoverAbierto = false" />
          <FormBusqueda v-else-if="componenteActivo === 'busqueda'" />
          <CentrosAcopio v-else-if="componenteActivo === 'acopio'" />
          <VoluntariadoMedico v-else-if="componenteActivo === 'voluntariado'" />
        </div>
      </template>
    </USlideover>



    <!-- UModal: Compartir Plataforma -->
    <UModal v-model:open="modalCompartirAbierto" title="Compartir Plataforma"
      description="Ayuda a difundir esta herramienta ligera para que más personas puedan reportar emergencias y buscar familiares.">
      <template #body>
        <div class="space-y-4">
          <div class="p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-between gap-2">
            <span class="text-xs text-neutral-600 truncate">https://emergencia.joch.dev</span>
            <UButton label="Copiar Enlace" size="xs" color="neutral" variant="subtle" icon="i-lucide-copy" @click="() => {
              navigator.clipboard.writeText('https://emergencia.joch.dev');
            }" />
          </div>
          <div class="flex flex-col sm:flex-row gap-2">
            <UButton label="Compartir en WhatsApp" color="success" variant="solid" icon="i-simple-icons-whatsapp"
              class="w-full justify-center"
              to="https://api.whatsapp.com/send?text=Si%20necesitas%20reportar%20afectados%20o%20buscar%20familiares%20por%20la%20emergencia%2C%20usa%20esta%20plataforma%20ligera%3A%20https%3A%2F%2Femergencia.joch.dev"
              target="_blank" />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Consejos de Conectividad -->
    <div class="max-w-5xl mx-auto w-full pt-8 border-t border-neutral-100">
      <div class="p-5 bg-neutral-50 rounded-xl border border-neutral-100 space-y-3">
        <h4 class="font-bold text-neutral-800 flex items-center gap-1.5 text-sm">
          <UIcon name="i-lucide-wifi-off" class="text-amber-600" />
          Consejos para Conexiones Débiles
        </h4>
        <ul class="text-xs text-neutral-600 list-disc list-inside space-y-1.5 leading-relaxed">
          <li>Si la web no carga, deshabilite la descarga de imágenes en su navegador.</li>
          <li>Utilice el GPS con el botón automático del formulario, consume menos datos que escribir.</li>
          <li>Mantenga el brillo de la pantalla al mínimo para reservar la batería del móvil.</li>
        </ul>
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
