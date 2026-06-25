<script setup lang="ts">
import { ref, computed, inject, onMounted, watch } from 'vue'
import { useSupabase } from '~/utils/supabase'

const emit = defineEmits(['success'])

const VENEZUELA_UBICACIONES = inject<any>('ubicaciones')

const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const privacidadAceptada = ref(false)

const { isMobile } = useDevice()

const cedulaTipo = ref('V')
const cedulaNumero = ref('')

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

onMounted(() => {
  const saved = localStorage.getItem('borrador_reporte')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed.form) form.value = { ...form.value, ...parsed.form }
      if (parsed.cedulaTipo) cedulaTipo.value = parsed.cedulaTipo
      if (parsed.cedulaNumero) cedulaNumero.value = parsed.cedulaNumero
      if (parsed.privacidadAceptada !== undefined) privacidadAceptada.value = parsed.privacidadAceptada
    } catch (e) {
      console.error('Error al restaurar borrador:', e)
    }
  }
})

watch(
  () => ({
    form: form.value,
    cedulaTipo: cedulaTipo.value,
    cedulaNumero: cedulaNumero.value,
    privacidadAceptada: privacidadAceptada.value
  }),
  (newVal) => {
    localStorage.setItem('borrador_reporte', JSON.stringify(newVal))
  },
  { deep: true }
)

const estados = computed(() => {
  return (VENEZUELA_UBICACIONES?.value || []).map((e: any) => ({ label: e.nombre, value: e.id }))
})

const municipios = computed(() => {
  if (!form.value.estado_id) return []
  const estadoObj = (VENEZUELA_UBICACIONES?.value || []).find((e: any) => e.id === form.value.estado_id)
  return estadoObj ? estadoObj.municipios.map((m: any) => ({ label: m.nombre, value: m.id })) : []
})

const parroquias = computed(() => {
  if (!form.value.estado_id || !form.value.municipio_id) return []
  const estadoObj = (VENEZUELA_UBICACIONES?.value || []).find((e: any) => e.id === form.value.estado_id)
  if (!estadoObj) return []
  const municipioObj = estadoObj.municipios.find((m: any) => m.id === form.value.municipio_id)
  return municipioObj ? municipioObj.parroquias.map((p: any) => ({ label: p.nombre, value: p.id })) : []
})

const onEstadoChange = () => {
  form.value.municipio_id = null
  form.value.parroquia_id = null
}

const onMunicipioChange = () => {
  form.value.parroquia_id = null
}

const gpsLoading = ref(false)
const gpsSuccess = ref(false)

const obtenerGPS = () => {
  if (!navigator.geolocation) {
    alert("Geolocalización no soportada por su navegador.")
    return
  }
  gpsLoading.value = true
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
      alert("No se pudo obtener la ubicación. Por favor, ingrese su dirección manualmente.")
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  )
}

const estadoPersonaOptions = [
  { label: 'Atrapado / Herido', value: 'Atrapado / Herido' },
  { label: 'Desaparecido', value: 'Desaparecido' },
  { label: 'A salvo en el sitio (Requiere asistencia)', value: 'A salvo en el sitio (Requiere asistencia)' }
]

const submitReporte = async () => {
  if (!form.value.estado_id || !form.value.municipio_id || !form.value.parroquia_id || !form.value.direccion_exacta) {
    errorMsg.value = 'Por favor complete la ubicación (Estado, Municipio, Parroquia y Dirección exacta).'
    return
  }
  if (!privacidadAceptada.value) {
    errorMsg.value = 'Debe aceptar los términos de privacidad para poder enviar el reporte.'
    return
  }
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const supabase = useSupabase()
    const cedulaFormateada = cedulaNumero.value ? `${cedulaTipo.value}-${cedulaNumero.value}` : ''
    const nombreGuardar = form.value.nombre_completo
      ? `${form.value.nombre_completo}${cedulaFormateada ? ' (CI: ' + cedulaFormateada + ')' : ''}`
      : (cedulaFormateada ? `CI: ${cedulaFormateada}` : null)

    const { error } = await supabase.from('reportes_emergencias').insert([
      {
        estado_id: Number(form.value.estado_id),
        municipio_id: Number(form.value.municipio_id),
        parroquia_id: Number(form.value.parroquia_id),
        direccion_exacta: form.value.direccion_exacta,
        nombre_completo: nombreGuardar,
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
    localStorage.removeItem('borrador_reporte')
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
    cedulaNumero.value = ''
    cedulaTipo.value = 'V'
    gpsSuccess.value = false
    privacidadAceptada.value = false
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
  <div class="space-y-5">
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

      <UFormField label="Estado" required help="Seleccione el estado de Venezuela donde ocurre la situación.">
        <USelectMenu
          v-model="form.estado_id"
          :items="estados"
          placeholder="Seleccione"
          class="w-full text-neutral-800"
          value-key="value"
          @update:modelValue="onEstadoChange"
        />
      </UFormField>

      <UFormField label="Municipio" required help="Filtre por municipio correspondiente al estado elegido.">
        <USelectMenu
          v-model="form.municipio_id"
          :items="municipios"
          placeholder="Seleccione"
          :disabled="!form.estado_id"
          value-key="value"
          class="w-full text-neutral-800"
          @update:modelValue="onMunicipioChange"
        />
      </UFormField>

      <UFormField label="Parroquia" required help="Indique la parroquia o sector de la localidad.">
        <USelectMenu
          v-model="form.parroquia_id"
          :items="parroquias"
          placeholder="Seleccione"
          value-key="value"
          :disabled="!form.municipio_id"
          class="w-full text-neutral-800"
        />
      </UFormField>

      <!-- Dirección exacta -->
      <UFormField label="Dirección Exacta o Punto de Referencia" required help="Indique detalles como nombres de calles, locales, colores de casas o referencias conocidas.">
        <UTextarea
          v-model="form.direccion_exacta"
          placeholder="Ej: Av. Principal, frente a la panadería, casa de dos pisos destruida."
          :rows="2"
          class="w-full text-neutral-800"
        />
      </UFormField>

      <UFormField label="Nombre del Afectado (Opcional)" help="Nombre y apellido de la persona en situación de riesgo.">
        <UInput
          v-model="form.nombre_completo"
          placeholder="Ej. Juan Pérez"
          class="w-full text-neutral-800"
        />
      </UFormField>

      <UFormField label="Cédula del Afectado (Opcional)" help="Documento de identidad del afectado para agilizar el cruce de datos.">
        <div class="flex gap-1.5 w-full">
          <USelectMenu
            v-model="cedulaTipo"
            :items="['V', 'E']"
            class="w-20 text-neutral-800"
          />
          <UInput
            v-model="cedulaNumero"
            placeholder="12345678"
            inputmode="numeric"
            pattern="[0-9]*"
            class="flex-1 text-neutral-800"
          />
        </div>
      </UFormField>

      <UFormField label="Estado de la Situación" required help="Estatus de gravedad o localización del afectado.">
        <USelectMenu
          v-model="form.estado_persona"
          :items="estadoPersonaOptions"
          value-key="value"
          class="w-full text-neutral-800"
        />
      </UFormField>

      <!-- GPS Pasivo Ancho Completo -->
      <div class="space-y-2">
        <UButton
          type="button"
          color="primary"
          variant="outline"
          class="w-full justify-center py-2.5 font-semibold animate-pulse"
          :loading="gpsLoading"
          :icon="gpsSuccess ? 'i-lucide-check' : 'i-lucide-map-pin'"
          @click="obtenerGPS"
        >
          {{ gpsSuccess ? '✓ Coordenadas capturadas' : (isMobile ? '📍 Adjuntar GPS actual (Recomendado en celular)' : '📍 Adjuntar mis coordenadas GPS actuales') }}
        </UButton>
        <div v-if="gpsSuccess" class="mt-3 p-3.5 bg-neutral-100 rounded-xl border border-neutral-200 text-center space-y-2.5">
          <div class="text-xs text-neutral-700 font-mono font-semibold flex items-center justify-center gap-1">
            <span>📍</span> Lat: <span class="text-neutral-900">{{ form.latitud }}</span> | Lon: <span class="text-neutral-900">{{ form.longitud }}</span>
          </div>
          <div class="flex justify-center">
            <UButton
              :to="`https://www.google.com/maps/search/?api=1&query=${form.latitud},${form.longitud}`"
              target="_blank"
              size="xs"
              variant="solid"
              color="primary"
              icon="i-lucide-map"
              class="cursor-pointer font-bold text-white shadow-sm"
            >
              ¿Estás aquí? Verificar en Google Maps
            </UButton>
          </div>
        </div>
      </div>

      <!-- Detalles adicionales -->
      <UFormField label="Detalles de la Situación (Opcional)">
        <UTextarea
          v-model="form.detalles_emergencia"
          placeholder="Describa brevemente la urgencia para priorizar el rescate..."
          :rows="2"
          class="w-full text-neutral-800"
        />
      </UFormField>

      <!-- Contacto opcional -->
      <div class="border-t border-neutral-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <UFormField label="Nombre de quien reporta (Opcional)">
          <UInput
            v-model="form.reportado_por_nombre"
            placeholder="Tu nombre"
            class="w-full text-neutral-800"
          />
        </UFormField>

        <UFormField label="Teléfono de contacto (Opcional)">
          <UInput
            v-model="form.reportado_por_telefono"
            placeholder="Ej: 04121234567"
            inputmode="numeric"
            pattern="[0-9]*"
            class="w-full text-neutral-800"
          />
        </UFormField>
      </div>

      <!-- Checkbox de privacidad obligatorio -->
      <div class="border-t border-neutral-200 pt-4">
        <UCheckbox
          v-model="privacidadAceptada"
          class="text-xs text-neutral-600"
          required
        >
          <template #label>
            <span>
              Entiendo y acepto la
              <NuxtLink to="/privacidad" target="_blank" class="underline text-primary-500 font-semibold hover:text-primary-600 cursor-pointer">
                Política de Privacidad y Manejo de Datos de Emergencia
              </NuxtLink>.
            </span>
          </template>
        </UCheckbox>
      </div>
      <!-- Botón Enviar integrado -->
      <div class="pt-4 border-t border-neutral-200">
        <UButton
          color="primary"
          variant="solid"
          size="lg"
          :loading="loading"
          icon="i-lucide-send"
          class="w-full justify-center py-3 font-bold cursor-pointer"
          @click="submitReporte"
        >
          Enviar Reporte de Emergencia
        </UButton>
      </div>
    </div>
</template>
