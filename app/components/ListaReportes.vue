<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabase } from '~/utils/supabase'
import { VENEZUELA_UBICACIONES } from '~/utils/venezuelaData'

const reportes = ref<any[]>([])
const busquedas = ref<any[]>([])
const loading = ref(false)
const filterEstado = ref<number | null>(null)

const estadosFiltro = [
  { label: 'Todos los Estados', value: null as any },
  ...VENEZUELA_UBICACIONES.map(e => ({ label: e.nombre, value: e.id }))
]

const getEstadoNombre = (id: number) => {
  const estado = VENEZUELA_UBICACIONES.find(e => e.id === id)
  return estado ? estado.nombre : 'Desconocido'
}

const getMunicipioNombre = (estadoId: number, municipioId: number) => {
  const estado = VENEZUELA_UBICACIONES.find(e => e.id === estadoId)
  if (!estado) return 'Desconocido'
  const mun = estado.municipios.find(m => m.id === municipioId)
  return mun ? mun.nombre : 'Desconocido'
}

const getParroquiaNombre = (estadoId: number, municipioId: number, parroquiaId: number) => {
  const estado = VENEZUELA_UBICACIONES.find(e => e.id === estadoId)
  if (!estado) return 'Desconocido'
  const mun = estado.municipios.find(m => m.id === municipioId)
  if (!mun) return 'Desconocido'
  const parr = mun.parroquias.find(p => p.id === parroquiaId)
  return parr ? parr.nombre : 'Desconocido'
}

const formatFecha = (fechaStr: string) => {
  if (!fechaStr) return ''
  const date = new Date(fechaStr)
  return date.toLocaleString('es-VE', { timeZone: 'America/Caracas' })
}

const fetchDatos = async () => {
  loading.value = true
  try {
    const supabase = useSupabase()

    let repQuery = supabase
      .from('reportes_victimas')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(60)

    if (filterEstado.value) {
      repQuery = repQuery.eq('estado_id', filterEstado.value)
    }

    const { data: repData, error: repErr } = await repQuery
    if (repErr) throw repErr
    reportes.value = repData || []

    let busQuery = supabase
      .from('busqueda_familiares')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(60)

    if (filterEstado.value) {
      busQuery = busQuery.eq('estado_ultimo_visto', filterEstado.value)
    }

    const { data: busData, error: busErr } = await busQuery
    if (busErr) throw busErr
    busquedas.value = busData || []
  } catch (err) {
    console.error('Error al cargar datos:', err)
  } finally {
    loading.value = false
  }
}

const getBadgeColor = (estadoPersona: string) => {
  switch (estadoPersona) {
    case 'Atrapado/Herido':
      return 'error'
    case 'Desaparecido':
      return 'warning'
    case 'A salvo':
      return 'success'
    case 'Fallecido':
      return 'neutral'
    default:
      return 'neutral'
  }
}

onMounted(() => {
  fetchDatos()
})

defineExpose({
  refresh: fetchDatos
})
</script>

<template>
  <div class="space-y-6">
    <!-- Controles superiores -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
      <div class="flex items-center gap-3">
        <UFormField label="Filtrar por Estado" class="w-full md:w-64">
          <USelect
            v-model="filterEstado"
            :items="estadosFiltro"
            value-key="value"
            class="w-full"
            @update:modelValue="fetchDatos"
          />
        </UFormField>
      </div>

      <UButton
        color="neutral"
        variant="subtle"
        icon="i-lucide-refresh-cw"
        :loading="loading"
        @click="fetchDatos"
      >
        Actualizar Datos
      </UButton>
    </div>

    <!-- Contenido en dos columnas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Columna 1: Emergencias Recientes -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 border-b border-neutral-800 pb-2">
          <UIcon name="i-lucide-alert-octagon" class="text-error size-5" />
          <h3 class="text-lg font-bold text-highlighted">Emergencias Reportadas ({{ reportes.length }})</h3>
        </div>

        <div v-if="loading" class="flex justify-center p-8">
          <UIcon name="i-lucide-loader" class="animate-spin text-muted size-8" />
        </div>

        <div v-else-if="reportes.length === 0" class="p-8 text-center text-muted bg-neutral-950 rounded-xl border border-neutral-900">
          No hay reportes de emergencia registrados para esta ubicación.
        </div>

        <div v-else class="space-y-3 overflow-y-auto max-h-[600px] pr-1">
          <UCard
            v-for="rep in reportes"
            :key="rep.id"
            class="bg-neutral-950 border border-neutral-900 hover:border-neutral-800 transition"
          >
            <div class="space-y-2">
              <div class="flex justify-between items-start gap-2">
                <span class="text-xs text-muted">{{ formatFecha(rep.created_at) }}</span>
                <UBadge :color="getBadgeColor(rep.estado_persona)" variant="soft">
                  {{ rep.estado_persona }}
                </UBadge>
              </div>

              <div>
                <h4 class="font-semibold text-highlighted text-sm">
                  {{ rep.nombre_completo || 'Persona no identificada' }}
                </h4>
                <p class="text-xs text-neutral-400 mt-0.5">
                  📍 {{ getEstadoNombre(rep.estado_id) }} • {{ getMunicipioNombre(rep.estado_id, rep.municipio_id) }} • {{ getParroquiaNombre(rep.estado_id, rep.municipio_id, rep.parroquia_id) }}
                </p>
                <p class="text-xs text-muted">
                  Dirección: {{ rep.direccion_exacta }}
                </p>
              </div>

              <p v-if="rep.detalles_emergencia" class="text-sm bg-neutral-900/50 p-2 rounded text-neutral-300">
                {{ rep.detalles_emergencia }}
              </p>

              <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-900 text-xs">
                <div v-if="rep.latitud && rep.longitud" class="flex items-center gap-1 text-primary">
                  <UIcon name="i-lucide-map" />
                  <a
                    :href="`https://www.google.com/maps/search/?api=1&query=${rep.latitud},${rep.longitud}`"
                    target="_blank"
                    class="underline font-medium hover:text-white"
                  >
                    Ver en Mapa ({{ rep.latitud.toFixed(4) }}, {{ rep.longitud.toFixed(4) }})
                  </a>
                </div>
                <div v-if="rep.reportado_por_telefono" class="text-muted">
                  Reportado por: {{ rep.reportado_por_nombre || 'Anónimo' }} • <a :href="`tel:${rep.reportado_por_telefono}`" class="underline text-highlighted">{{ rep.reportado_por_telefono }}</a>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Columna 2: Personas Buscadas -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 border-b border-neutral-800 pb-2">
          <UIcon name="i-lucide-search" class="text-primary size-5" />
          <h3 class="text-lg font-bold text-highlighted">Familiares Buscados ({{ busquedas.length }})</h3>
        </div>

        <div v-if="loading" class="flex justify-center p-8">
          <UIcon name="i-lucide-loader" class="animate-spin text-muted size-8" />
        </div>

        <div v-else-if="busquedas.length === 0" class="p-8 text-center text-muted bg-neutral-950 rounded-xl border border-neutral-900">
          No hay solicitudes de búsqueda registradas.
        </div>

        <div v-else class="space-y-3 overflow-y-auto max-h-[600px] pr-1">
          <UCard
            v-for="bus in busquedas"
            :key="bus.id"
            class="bg-neutral-950 border border-neutral-900 hover:border-neutral-800 transition"
          >
            <div class="space-y-2">
              <div class="flex justify-between items-start gap-2">
                <span class="text-xs text-muted">{{ formatFecha(bus.created_at) }}</span>
                <span v-if="bus.cedula_buscado" class="text-xs font-semibold bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">
                  C.I: {{ bus.cedula_buscado }}
                </span>
              </div>

              <div>
                <h4 class="font-bold text-highlighted text-sm">
                  🔍 {{ bus.nombre_buscado }}
                </h4>
                <p v-if="bus.estado_ultimo_visto" class="text-xs text-neutral-400 mt-0.5">
                  Última ubicación vista: {{ getEstadoNombre(bus.estado_ultimo_visto) }}
                </p>
              </div>

              <p v-if="bus.detalles_adicionales" class="text-sm bg-neutral-900/50 p-2 rounded text-neutral-300">
                {{ bus.detalles_adicionales }}
              </p>

              <div class="pt-2 border-t border-neutral-900 text-xs text-muted">
                Contacto de búsqueda: <span class="text-highlighted">{{ bus.quien_busca_contacto }}</span>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>
