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
  if (!municipioId) {
    return estado ? `Estado ${estado.nombre}` : 'Ubicación no especificada'
  }
  const municipio = estado?.municipios.find((m: any) => m.id === municipioId)
  if (estado && municipio) {
    return `Estado ${estado.nombre}, Municipio ${municipio.nombre}`
  }
  return 'Ubicación no especificada'
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('es-VE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const consultarEstatus = async () => {
  if (!query.value.trim()) return

  loading.value = true
  consultado.value = false
  resultados.value = []

  try {
    const supabase = useSupabase()
    const term = query.value.trim()
    
    // Buscar en reportes_emergencias
    const { data: dataReportes, error: errorReportes } = await supabase
      .from('reportes_emergencias')
      .select('*, bitacora_incidentes(*, refugios(nombre_refugio, latitud, longitud), centros_medicos(nombre, latitud, longitud))')
      .or(`nombre_completo.ilike.%${term}%,detalles_emergencia.ilike.%${term}%`)
      .limit(5)

    // Buscar en busqueda_familiares
    const { data: dataBusqueda, error: errorBusqueda } = await supabase
      .from('busqueda_familiares')
      .select('*, bitacora_casos(*)')
      .or(`nombre_buscado.ilike.%${term}%,cedula_buscado.ilike.%${term}%`)
      .limit(5)

    const combined = []

    if (dataReportes && dataReportes.length > 0) {
      dataReportes.forEach((r: any) => {
        combined.push({
          tipo: 'reporte',
          id: r.id,
          nombre: r.nombre_completo,
          estatus: r.estado_persona,
          estado_id: r.estado_id,
          municipio_id: r.municipio_id,
          direccion: r.direccion_exacta,
          bitacora: r.bitacora_incidentes ? r.bitacora_incidentes.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : []
        })
      })
    }

    if (dataBusqueda && dataBusqueda.length > 0) {
      dataBusqueda.forEach((b: any) => {
        combined.push({
          tipo: 'busqueda',
          id: b.id,
          nombre: b.nombre_buscado,
          estatus: b.estatus,
          estado_id: b.estado_ultimo_visto,
          municipio_id: null,
          direccion: b.ubicacion_actual || b.detalles_adicionales,
          bitacora: b.bitacora_casos ? b.bitacora_casos.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : []
        })
      })
    }

    resultados.value = combined
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

    <div class="mt-4 p-4 bg-zinc-900 rounded-lg shadow-sm border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h4 class="font-bold text-white text-sm flex items-center gap-2">
          <UIcon name="i-lucide-bot" class="w-4 h-4 text-primary" />
          ¿Tienes datos limitados?
        </h4>
        <p class="text-xs text-zinc-400 mt-1">
          Usa nuestro Bot de Telegram para consultas más rápidas y suscríbete a alertas automáticas.
        </p>
      </div>
      <UButton 
        to="/bot" 
        color="primary" 
        variant="solid" 
        size="sm"
        class="shrink-0"
      >
        Ver Guía de Uso
      </UButton>
    </div>

    <!-- Resultados (Oculto por defecto hasta consultar) -->
    <div v-if="consultado" class="space-y-4 pt-2">
      <div v-if="resultados.length > 0" class="space-y-3">
        <div
          v-for="(registro, idx) in resultados"
          :key="idx"
          class="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2 text-xs md:text-sm text-neutral-800"
        >
          <div class="flex items-start justify-between gap-2">
            <span class="font-bold text-neutral-900 uppercase flex items-center gap-1.5">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              ✓ Registro Encontrado
            </span>
            <span class="px-2 py-0.5 rounded bg-neutral-200 text-[10px] text-neutral-700 font-mono font-bold uppercase">
              {{ registro.estatus }}
            </span>
          </div>
          <p class="text-neutral-800 leading-relaxed">
            <strong>{{ registro.nombre || 'Persona sin identificar' }}</strong> se encuentra en estatus <strong class="text-emerald-700">"{{ registro.estatus }}"</strong> en {{ obtenerUbicacionTexto(registro.estado_id, registro.municipio_id) }}.
          </p>
          <p v-if="registro.direccion" class="text-neutral-600 text-xs">
            Ubicación de referencia: {{ registro.direccion }}
          </p>

          <!-- Timeline -->
          <div v-if="registro.bitacora && registro.bitacora.length > 0" class="mt-4 pt-3 border-t border-emerald-200/60">
            <h4 class="text-[11px] uppercase font-bold text-emerald-800 mb-3 tracking-wider">Línea de Tiempo</h4>
            <div class="relative pl-3 border-l border-emerald-300 space-y-3">
              <div v-for="log in registro.bitacora" :key="log.id" class="relative">
                <span class="absolute -left-[17px] top-1.5 size-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                <div class="text-xs">
                  <div class="flex justify-between items-center text-neutral-500 mb-0.5">
                    <span class="font-mono text-[10px]">{{ formatDate(log.created_at) }}</span>
                  </div>
                  <div class="p-2 rounded bg-white border border-emerald-100 shadow-sm space-y-1">
                    <span class="font-bold text-neutral-700 block mb-0.5">Estatus: {{ log.estatus || log.estado_persona }}</span>
                    <p class="text-neutral-600 leading-relaxed">{{ log.detalles }}</p>

                    <!-- Detalles de Ubicación Adicionales -->
                    <div v-if="log.ubicacion_actual" class="flex items-start gap-1.5 mt-1 pt-1 border-t border-neutral-100">
                      <UIcon name="i-lucide-map-pin" class="text-primary size-3.5 mt-0.5" />
                      <span class="text-neutral-600 font-mono text-[10px]">Ubicación: <strong>{{ log.ubicacion_actual }}</strong></span>
                    </div>

                    <div v-if="log.refugios?.nombre_refugio || log.centros_medicos?.nombre" class="flex items-start gap-1.5 mt-1 pt-1 border-t border-neutral-100">
                      <UIcon name="i-lucide-building" class="text-primary size-3.5 mt-0.5" />
                      <div class="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span class="text-neutral-600 font-mono text-[10px]">
                          Lugar: <strong>{{ log.refugios?.nombre_refugio || log.centros_medicos?.nombre }}</strong>
                        </span>
                        
                        <UButton
                          v-if="(log.refugios?.latitud && log.refugios?.longitud) || (log.centros_medicos?.latitud && log.centros_medicos?.longitud)"
                          size="2xs"
                          color="primary"
                          variant="soft"
                          icon="i-lucide-map"
                          :to="`https://www.google.com/maps/search/?api=1&query=${log.refugios?.latitud || log.centros_medicos?.latitud},${log.refugios?.longitud || log.centros_medicos?.longitud}`"
                          target="_blank"
                        >
                          Ir al sitio
                        </UButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
            Las autoridades y voluntarios siguen actualizando las listas. Intenta buscando con variaciones del nombre o el número de cédula.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
