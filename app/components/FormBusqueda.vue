<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import { useSupabase } from '~/utils/supabase'

const ultimaActualizacionTexto = ref('Cargando...')

const actualizarTiempoTranscurrido = async () => {
  try {
    const supabase = useSupabase()
    const { data, error } = await supabase
      .from('reportes_emergencias')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) throw error

    if (data && data.length > 0) {
      const fecha = new Date(data[0].created_at)
      const ahora = new Date()
      const diffMs = ahora.getTime() - fecha.getTime()
      const diffMins = Math.floor(diffMs / 60000)

      if (diffMins < 1) {
        ultimaActualizacionTexto.value = 'Hace menos de un minuto'
      } else if (diffMins < 60) {
        ultimaActualizacionTexto.value = `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
      } else {
        const diffHoras = Math.floor(diffMins / 60)
        if (diffHoras < 24) {
          ultimaActualizacionTexto.value = `Hace ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`
        } else {
          const diffDias = Math.floor(diffHoras / 24)
          ultimaActualizacionTexto.value = `Hace ${diffDias} día${diffDias > 1 ? 's' : ''}`
        }
      }
    } else {
      ultimaActualizacionTexto.value = 'Sin registros previos'
    }
  } catch (err) {
    console.error('Error al obtener última actualización:', err)
    ultimaActualizacionTexto.value = 'No disponible'
  }
}

onMounted(() => {
  actualizarTiempoTranscurrido()
  const interval = setInterval(actualizarTiempoTranscurrido, 60000)
  return () => clearInterval(interval)
})

const VENEZUELA_UBICACIONES = inject<any>('ubicaciones')

const loading = ref(false)
const query = ref('')
const consultado = ref(false)
const resultados = ref<any[]>([])

const obtenerUbicacionTexto = (estadoId: number, municipioId: number) => {
  const estado = (VENEZUELA_UBICACIONES?.value || []).find((e: any) => e.id === estadoId)
  const municipio = estado?.municipios.find((m: any) => m.id === municipioId)
  if (estado && municipio) {
    return `Estado ${estado.nombre}, Municipio ${municipio.nombre}`
  }
  return 'Ubicación no especificada'
}

const consultarEstatus = async () => {
  if (!query.value.trim()) return

  loading.value = true
  consultado.value = false
  resultados.value = []

  try {
    const supabase = useSupabase()
    
    // Buscar en reportes_emergencias
    const { data, error } = await supabase
      .from('reportes_emergencias')
      .select('*')
      .or(`nombre_completo.ilike.%${query.value.trim()}%,detalles_emergencia.ilike.%${query.value.trim()}%`)
      .limit(5)

    if (error) throw error

    resultados.value = data || []
    consultado.value = true
  } catch (err) {
    console.error('Error al buscar familiar:', err)
    alert('Ocurrió un error al consultar el estatus. Por favor intente de nuevo.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 w-full">
      <UInput
        v-model="query"
        placeholder="Ej: V-12.345.678 o Carlos Eduardo Pérez"
        class="w-full text-neutral-800"
        size="lg"
        @keyup.enter="consultarEstatus"
      />
      <UButton
        color="primary"
        variant="solid"
        size="lg"
        :loading="loading"
        icon="i-lucide-search"
        class="w-full justify-center font-bold cursor-pointer"
        @click="consultarEstatus"
      >
        Consultar Estatus
      </UButton>
    </div>

    <div class="flex items-center gap-1.5 text-xs text-neutral-500 justify-center sm:justify-start">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span>Última actualización de datos: <strong>{{ ultimaActualizacionTexto }}</strong></span>
    </div>

    <!-- Resultados (Oculto por defecto hasta consultar) -->
    <div v-if="consultado" class="space-y-4 pt-2">
      <div v-if="resultados.length > 0" class="space-y-3">
        <div
          v-for="registro in resultados"
          :key="registro.id"
          class="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2 text-xs md:text-sm text-neutral-800"
        >
          <div class="flex items-start justify-between gap-2">
            <span class="font-bold text-neutral-900 uppercase flex items-center gap-1.5">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              ✓ Registro Encontrado
            </span>
            <span class="px-2 py-0.5 rounded bg-neutral-200 text-[10px] text-neutral-700 font-mono">
              {{ registro.estado_persona }}
            </span>
          </div>
          <p class="text-neutral-800 leading-relaxed">
            <strong>{{ registro.nombre_completo || 'Persona sin identificar' }}</strong> se encuentra registrado con estatus <strong class="text-emerald-700">"{{ registro.estado_persona }}"</strong> en el {{ obtenerUbicacionTexto(registro.estado_id, registro.municipio_id) }}.
          </p>
          <p v-if="registro.direccion_exacta" class="text-neutral-600 text-xs">
            Ubicación de referencia: {{ registro.direccion_exacta }}
          </p>
        </div>
      </div>

      <div
        v-else
        class="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start gap-3 text-xs md:text-sm text-neutral-800"
      >
        <UIcon name="i-lucide-circle-alert" class="text-amber-600 size-5 shrink-0 mt-0.5" />
        <div>
          <span class="font-bold text-neutral-900 block">⚠️ No se encontraron reportes con estos datos aún.</span>
          <span class="text-neutral-600 block mt-1">
            Las autoridades y voluntarios siguen actualizando las listas. Intenta buscando con variaciones del nombre o apellido.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
