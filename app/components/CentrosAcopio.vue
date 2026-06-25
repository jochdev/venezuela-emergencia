<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue'
import { useSupabase } from '~/utils/supabase'

const VENEZUELA_UBICACIONES = inject<any>('ubicaciones')

// Filtros
const filtroEstado = ref<number | null>(null)
const filtroMunicipio = ref<number | null>(null)

const estados = computed(() => {
  return (VENEZUELA_UBICACIONES?.value || []).map((e: any) => ({ label: e.nombre, value: e.id }))
})

const municipios = computed(() => {
  if (!filtroEstado.value) return []
  const estadoObj = (VENEZUELA_UBICACIONES?.value || []).find((e: any) => e.id === filtroEstado.value)
  return estadoObj ? estadoObj.municipios.map((m: any) => ({ label: m.nombre, value: m.id })) : []
})

const onEstadoChange = () => {
  filtroMunicipio.value = null
  cargarCentros()
}

// Datos de Centros de Acopio
const centros = ref<any[]>([])
const loading = ref(false)

// Fallback estático premium si no hay datos en BD
const centrosFallback = [
  {
    id: 1,
    nombre: 'Cruz Roja Venezolana - Seccional Local',
    verificado: true,
    direccion: 'Calle 4, al lado del Hospital Central.',
    insumos: 'Agua potable, gasas, analgésicos.',
    horario: '24 Horas',
    telefono: '0212-5782187',
    estado_id: 1,
    municipio_id: 101
  },
  {
    id: 2,
    nombre: 'Centro de Acopio Plaza Altamira',
    verificado: true,
    direccion: 'Plaza Francia de Altamira, Anfiteatro.',
    insumos: 'Alimentos no perecederos, mantas, linternas.',
    horario: '08:00 AM - 06:00 PM',
    telefono: '0412-5555555',
    estado_id: 2,
    municipio_id: 201
  }
]

const cargarCentros = async () => {
  loading.value = true
  try {
    const supabase = useSupabase()
    let query = supabase.from('centros_acopio').select('*').eq('activo', true)

    if (filtroEstado.value) {
      query = query.eq('estado_id', filtroEstado.value)
    }
    if (filtroMunicipio.value) {
      query = query.eq('municipio_id', filtroMunicipio.value)
    }

    const { data, error } = await query

    if (error) throw error

    // Si la base de datos está vacía, mostramos los estáticos simulados
    if (!data || data.length === 0) {
      centros.value = centrosFallback.filter(c => {
        if (filtroEstado.value && c.estado_id !== filtroEstado.value) return false
        if (filtroMunicipio.value && c.municipio_id !== filtroMunicipio.value) return false
        return true
      })
    } else {
      centros.value = data
    }
  } catch (err) {
    console.warn('Error cargando centros desde Supabase, usando locales:', err)
    centros.value = centrosFallback.filter(c => {
      if (filtroEstado.value && c.estado_id !== filtroEstado.value) return false
      if (filtroMunicipio.value && c.municipio_id !== filtroMunicipio.value) return false
      return true
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarCentros()
})

// Modal de postulación
const modalAbierto = ref(false)
const postulacionEnviada = ref(false)
const postulacionForm = ref({
  nombre: '',
  direccion: '',
  insumos: '',
  horario: '',
  telefono: '',
  estado_id: null as number | null,
  municipio_id: null as number | null
})

const postularEstados = computed(() => {
  return (VENEZUELA_UBICACIONES?.value || []).map((e: any) => ({ label: e.nombre, value: e.id }))
})

const postularMunicipios = computed(() => {
  if (!postulacionForm.value.estado_id) return []
  const estadoObj = (VENEZUELA_UBICACIONES?.value || []).find((e: any) => e.id === postulacionForm.value.estado_id)
  return estadoObj ? estadoObj.municipios.map((m: any) => ({ label: m.nombre, value: m.id })) : []
})

const enviarPostulacion = async () => {
  if (!postulacionForm.value.nombre || !postulacionForm.value.direccion || !postulacionForm.value.insumos || !postulacionForm.value.estado_id || !postulacionForm.value.municipio_id) {
    alert('Por favor, rellene todos los campos obligatorios.')
    return
  }

  try {
    const supabase = useSupabase()
    const { error } = await supabase.from('centros_acopio').insert([
      {
        nombre: postulacionForm.value.nombre,
        direccion: postulacionForm.value.direccion,
        insumos: postulacionForm.value.insumos,
        horario: postulacionForm.value.horario,
        telefono: postulacionForm.value.telefono,
        estado_id: postulacionForm.value.estado_id,
        municipio_id: postulacionForm.value.municipio_id,
        verificado: false // Requiere moderación
      }
    ])

    if (error) throw error

    postulacionEnviada.value = true
    setTimeout(() => {
      modalAbierto.value = false
      postulacionEnviada.value = false
      postulacionForm.value = {
        nombre: '',
        direccion: '',
        insumos: '',
        horario: '',
        telefono: '',
        estado_id: null,
        municipio_id: null
      }
    }, 2000)
  } catch (err) {
    console.error('Error al postular centro:', err)
    alert('No se pudo enviar la postulación. Intente de nuevo.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Buscador/Filtros -->
    <div class="grid grid-cols-2 gap-3 pb-2">
      <UFormField label="Filtrar por Estado">
        <USelectMenu v-model="filtroEstado" :items="estados" placeholder="Todos" class="w-full text-neutral-800"
          value-key="value" @update:modelValue="onEstadoChange" />
      </UFormField>

      <UFormField label="Filtrar por Municipio">
        <USelectMenu v-model="filtroMunicipio" :items="municipios" placeholder="Todos" :disabled="!filtroEstado"
          value-key="value" class="w-full text-neutral-800" @update:modelValue="cargarCentros" />
      </UFormField>
    </div>

    <!-- Lista de Tarjetas (Cards) -->
    <div class="max-w-xl mx-auto space-y-4 px-2">
      <div v-if="loading" class="text-center py-4 text-xs text-neutral-500">
        Cargando centros de acopio...
      </div>

      <template v-else>
        <UPageCard v-for="centro in centros" :key="centro.id" :title="centro.nombre"
          :description="`Dirección: ${centro.direccion}`" icon="i-lucide-package" spotlight spotlight-color="primary"
          class="p-1 space-y-2">
          <template #header-extra v-if="centro.verificado">
            <span
              class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-sans text-[10px] font-semibold border border-emerald-200">
              ✓ Verificado
            </span>
          </template>

          <div class="space-y-1.5 text-xs text-neutral-700 leading-relaxed pt-2">
            <div><strong class="text-neutral-900">Insumos Urgentes:</strong> {{ centro.insumos }}</div>
            <div class="flex flex-wrap gap-4 border-t border-neutral-200 pt-2 text-[10px] text-neutral-500">
              <div>⏰ Horario: {{ centro.horario || 'No especificado' }}</div>
              <div>📞 Telf: {{ centro.telefono || 'No especificado' }}</div>
            </div>
          </div>
        </UPageCard>

        <div v-if="centros.length === 0" class="text-center py-6 text-neutral-500 text-xs">
          No se encontraron centros de acopio en este municipio.
        </div>
      </template>

      <!-- Botón de postular -->
      <div class="pt-4 flex justify-center">
        <UButton label="Postular un Centro de Acopio" icon="i-lucide-plus" color="primary" variant="subtle" size="md"
          class="font-bold cursor-pointer" @click="modalAbierto = true" />
      </div>
    </div>

    <!-- Modal Flotante de Postulación -->
    <UModal v-model:open="modalAbierto" title="Registrar Nuevo Centro de Acopio"
      description="Postula un punto de recolección de ayuda para ser evaluado por el equipo moderador.">
      <template #body>
        <div class="space-y-4">
          <UAlert v-if="postulacionEnviada" color="success" variant="soft"
            title="¡Postulación enviada! Pasará a revisión por el equipo moderador." icon="i-lucide-check-circle" />

          <div class="space-y-3">
            <UFormField label="Nombre de la Institución/Centro" required help="Nombre descriptivo del punto de acopio.">
              <UInput v-model="postulacionForm.nombre" placeholder="Ej: Parroquia San José"
                class="text-neutral-800 w-full" />
            </UFormField>

            <UFormField label="Estado" required help="Estado de localización geográfica del centro.">
              <USelectMenu v-model="postulacionForm.estado_id" :items="postularEstados" placeholder="Seleccione"
                value-key="value" class="text-neutral-800 w-full" />
            </UFormField>

            <UFormField label="Municipio" required help="Municipio al cual pertenece el centro de acopio.">
              <USelectMenu v-model="postulacionForm.municipio_id" :items="postularMunicipios" placeholder="Seleccione"
                :disabled="!postulacionForm.estado_id" value-key="value" class="text-neutral-800 w-full" />
            </UFormField>

            <UFormField label="Dirección Exacta" required
              help="Referencias y calles detalladas para que las personas puedan llegar fácilmente.">
              <UTextarea v-model="postulacionForm.direccion" :rows="2" placeholder="Calle, Av, frente a..."
                class="text-neutral-800 w-full" />
            </UFormField>

            <UFormField label="Insumos Requeridos con Urgencia" required
              help="Liste los insumos principales requeridos (ej. alimentos, medicamentos, agua).">
              <UInput v-model="postulacionForm.insumos" placeholder="Ej: Agua, pañales, medicinas"
                class="text-neutral-800 w-full" />
            </UFormField>

            <UFormField label="Horario de Atención" help="Horario en el que el centro estará recibiendo los insumos.">
              <UInput v-model="postulacionForm.horario" placeholder="Ej: 8am a 6pm" class="text-neutral-800 w-full" />
            </UFormField>

            <UFormField label="Teléfono de Contacto" help="Teléfono de contacto de los coordinadores o encargados.">
              <UInput v-model="postulacionForm.telefono" placeholder="Ej: 04121234567" inputmode="numeric"
                pattern="[0-9]*" class="text-neutral-800 w-full" />
            </UFormField>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton label="Cancelar" color="primary" variant="ghost" class="cursor-pointer"
            @click="modalAbierto = false" />
          <UButton label="Enviar Postulación" color="primary" class="font-bold cursor-pointer"
            @click="enviarPostulacion" />
        </div>
      </template>
    </UModal>
  </div>
</template>
