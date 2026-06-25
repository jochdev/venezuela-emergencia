<script setup lang="ts">
import { ref, computed } from 'vue'
import { VENEZUELA_UBICACIONES } from '~/utils/venezuelaData'
import { useSupabase } from '~/utils/supabase'

const emit = defineEmits(['success'])

const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const form = ref({
  estado_id: null as number | null,
  municipio_id: null as number | null,
  parroquia_id: null as number | null,
  direccion_exacta: '',
  nombre_completo: '',
  estado_persona: 'Desaparecido',
  detalles_emergencia: '',
  latitud: null as number | null,
  longitud: null as number | null,
  reportado_por_nombre: '',
  reportado_por_telefono: ''
})

const estados = computed(() => {
  return VENEZUELA_UBICACIONES.map(e => ({ label: e.nombre, value: e.id }))
})

const municipios = computed(() => {
  if (!form.value.estado_id) return []
  const estadoObj = VENEZUELA_UBICACIONES.find(e => e.id === form.value.estado_id)
  return estadoObj ? estadoObj.municipios.map(m => ({ label: m.nombre, value: m.id })) : []
})

const parroquias = computed(() => {
  if (!form.value.estado_id || !form.value.municipio_id) return []
  const estadoObj = VENEZUELA_UBICACIONES.find(e => e.id === form.value.estado_id)
  if (!estadoObj) return []
  const municipioObj = estadoObj.municipios.find(m => m.id === form.value.municipio_id)
  return municipioObj ? municipioObj.parroquias.map(p => ({ label: p.nombre, value: p.id })) : []
})

const onEstadoChange = () => {
  form.value.municipio_id = null
  form.value.parroquia_id = null
}

const onMunicipioChange = () => {
  form.value.parroquia_id = null
}

const gpsLoading = ref(false)
const gpsError = ref(false)
const gpsSuccess = ref(false)

const obtenerGPS = () => {
  if (!navigator.geolocation) {
    alert("Geolocalización no soportada por su navegador.")
    return
  }
  gpsLoading.value = true
  gpsError.value = false
  gpsSuccess.value = false
  navigator.geolocation.getCurrentPosition(
    (position) => {
      form.value.latitud = position.coords.latitude
      form.value.longitud = position.coords.longitude
      gpsLoading.value = false
      gpsSuccess.value = true
    },
    (err) => {
      console.warn("GPS error:", err)
      gpsLoading.value = false
      gpsError.value = true
    },
    { enableHighAccuracy: true, timeout: 8000 }
  )
}

const estadoPersonaOptions = [
  { label: 'Desaparecido', value: 'Desaparecido' },
  { label: 'Atrapado / Herido', value: 'Atrapado/Herido' },
  { label: 'A salvo', value: 'A salvo' },
  { label: 'Fallecido', value: 'Fallecido' }
]

const submitReporte = async () => {
  if (!form.value.estado_id || !form.value.municipio_id || !form.value.parroquia_id || !form.value.direccion_exacta) {
    errorMsg.value = 'Por favor complete la ubicación (Estado, Municipio, Parroquia y Dirección exacta)'
    return
  }
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const supabase = useSupabase()
    const { error } = await supabase.from('reportes_victimas').insert([
      {
        estado_id: Number(form.value.estado_id),
        municipio_id: Number(form.value.municipio_id),
        parroquia_id: Number(form.value.parroquia_id),
        direccion_exacta: form.value.direccion_exacta,
        nombre_completo: form.value.nombre_completo || null,
        estado_persona: form.value.estado_persona,
        detalles_emergencia: form.value.detalles_emergencia || null,
        latitud: form.value.latitud,
        longitud: form.value.longitud,
        reportado_por_nombre: form.value.reportado_por_nombre || null,
        reportado_por_telefono: form.value.reportado_por_telefono || null
      }
    ])

    if (error) throw error

    successMsg.value = '¡Reporte de emergencia enviado exitosamente!'
    // Reset form
    form.value = {
      estado_id: null,
      municipio_id: null,
      parroquia_id: null,
      direccion_exacta: '',
      nombre_completo: '',
      estado_persona: 'Desaparecido',
      detalles_emergencia: '',
      latitud: null,
      longitud: null,
      reportado_por_nombre: '',
      reportado_por_telefono: ''
    }
    gpsSuccess.value = false
    emit('success')
  } catch (err: any) {
    console.error('Error al guardar reporte:', err)
    errorMsg.value = `Error: ${err.message || 'No se pudo guardar el reporte. Verifique la conexión.'}`
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard class="w-full max-w-xl mx-auto shadow-xl bg-neutral-900 border border-neutral-800">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-alert-triangle" class="text-error size-6 animate-pulse" />
        <h2 class="text-xl font-bold text-highlighted">Reportar Emergencia / Afectado</h2>
      </div>
      <p class="text-xs text-muted mt-1">Este formulario se registra en tiempo real para rescate y monitoreo.</p>
    </template>

    <div class="space-y-4">
      <UAlert
        v-if="errorMsg"
        color="error"
        variant="soft"
        :title="errorMsg"
        icon="i-lucide-circle-alert"
      />
      <UAlert
        v-if="successMsg"
        color="success"
        variant="soft"
        :title="successMsg"
        icon="i-lucide-circle-check"
      />

      <!-- Ubicación -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <UFormField label="Estado" required>
          <USelect
            v-model="form.estado_id"
            :items="estados"
            placeholder="Seleccione"
            class="w-full"
            value-key="value"
            @update:modelValue="onEstadoChange"
          />
        </UFormField>

        <UFormField label="Municipio" required>
          <USelect
            v-model="form.municipio_id"
            :items="municipios"
            placeholder="Seleccione"
            :disabled="!form.estado_id"
            value-key="value"
            class="w-full"
            @update:modelValue="onMunicipioChange"
          />
        </UFormField>

        <UFormField label="Parroquia" required>
          <USelect
            v-model="form.parroquia_id"
            :items="parroquias"
            placeholder="Seleccione"
            value-key="value"
            :disabled="!form.municipio_id"
            class="w-full"
          />
        </UFormField>
      </div>

      <UFormField label="Dirección Exacta o Punto de Referencia" required>
        <UInput
          v-model="form.direccion_exacta"
          placeholder="Ej. Calle Principal frente al abasto, casa de portón azul"
          class="w-full"
        />
      </UFormField>

      <!-- Geolocalización -->
      <div class="p-3 bg-neutral-950 rounded-lg border border-neutral-850 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h4 class="text-sm font-semibold text-highlighted flex items-center gap-1.5">
            <UIcon name="i-lucide-map-pin" />
            Geolocalización GPS
          </h4>
          <p class="text-xs text-muted">Permite a los rescatistas llegar con coordenadas precisas.</p>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            type="button"
            color="neutral"
            variant="subtle"
            size="sm"
            :loading="gpsLoading"
            icon="i-lucide-locate"
            @click="obtenerGPS"
          >
            {{ gpsSuccess ? 'GPS Capturado' : 'Obtener Coordenadas' }}
          </UButton>
          <UIcon
            v-if="gpsSuccess"
            name="i-lucide-check-circle"
            class="text-success size-5"
          />
          <UIcon
            v-if="gpsError"
            name="i-lucide-x-circle"
            class="text-error size-5"
          />
        </div>
      </div>

      <!-- Datos de la Víctima -->
      <div class="border-t border-neutral-800 pt-4 space-y-4">
        <h3 class="text-sm font-bold text-neutral-300">Información del Afectado</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <UFormField label="Nombre Completo (Opcional)">
            <UInput
              v-model="form.nombre_completo"
              placeholder="Ej. Juan Pérez"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Estado de la Persona" required>
            <USelect
              v-model="form.estado_persona"
              :items="estadoPersonaOptions"
              value-key="value"
              class="w-full"
            />
          </UFormField>
        </div>

        <UFormField label="Detalles de la Emergencia / Situación">
          <UTextarea
            v-model="form.detalles_emergencia"
            placeholder="Describa la urgencia, ej: 'Inundación, nivel del agua subiendo rápido, hay 3 niños y 1 adulto mayor atrapados en el segundo piso.'"
            rows="3"
            class="w-full"
          />
        </UFormField>
      </div>

      <!-- Contacto del informante -->
      <div class="border-t border-neutral-800 pt-4 space-y-4">
        <h3 class="text-sm font-bold text-neutral-300">Datos de Quién Reporta (Autoridades)</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <UFormField label="Tu Nombre (Opcional)">
            <UInput
              v-model="form.reportado_por_nombre"
              placeholder="Ej. Vecino informante"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Tu Teléfono de Contacto (Opcional)">
            <UInput
              v-model="form.reportado_por_telefono"
              placeholder="Ej. 0412-1234567"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          color="error"
          variant="solid"
          size="lg"
          :loading="loading"
          icon="i-lucide-send"
          class="w-full md:w-auto"
          @click="submitReporte"
        >
          Enviar Reporte Crítico
        </UButton>
      </div>
    </template>
  </UCard>
</template>
