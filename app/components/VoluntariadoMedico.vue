<script setup lang="ts">
import { ref, computed, inject, onMounted, watch } from 'vue'
import { useSupabase } from '~/utils/supabase'

const VENEZUELA_UBICACIONES = inject<any>('ubicaciones')

const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const form = ref({
  nombre_completo: '',
  especialidad: '',
  estado_id: null as number | null,
  municipio_id: null as number | null,
  parroquia_id: null as number | null,
  dispone_transporte: false,
  tiene_insumos: false,
  telefono: ''
})

onMounted(() => {
  const saved = localStorage.getItem('borrador_voluntario')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      form.value = { ...form.value, ...parsed }
    } catch (e) {
      console.error('Error al restaurar borrador de voluntario:', e)
    }
  }
})

watch(
  form,
  (newVal) => {
    localStorage.setItem('borrador_voluntario', JSON.stringify(newVal))
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

const especialidades = [
  { label: 'Médico General', value: 'Médico General' },
  { label: 'Traumatólogo / Cirujano', value: 'Traumatólogo / Cirujano' },
  { label: 'Enfermero/a', value: 'Enfermero/a' },
  { label: 'Paramédico / Rescatista', value: 'Paramédico / Rescatista' },
  { label: 'Psicólogo (Primeros Auxilios)', value: 'Psicólogo (Primeros Auxilios)' }
]

const registrarVoluntario = async () => {
  if (!form.value.nombre_completo || !form.value.especialidad || !form.value.estado_id || !form.value.municipio_id || !form.value.parroquia_id || !form.value.telefono) {
    errorMsg.value = 'Por favor complete todos los campos obligatorios para el registro.'
    return
  }

  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const supabase = useSupabase()
    const { error } = await supabase.from('voluntarios_medicos').insert([
      {
        nombre_completo: form.value.nombre_completo,
        especialidad: form.value.especialidad,
        estado_id: Number(form.value.estado_id),
        municipio_id: Number(form.value.municipio_id),
        parroquia_id: Number(form.value.parroquia_id),
        dispone_transporte: form.value.dispone_transporte,
        tiene_insumos: form.value.tiene_insumos,
        telefono: form.value.telefono
      }
    ])

    if (error) throw error

    successMsg.value = '¡Te has registrado exitosamente como voluntario médico activo!'
    localStorage.removeItem('borrador_voluntario')
    
    // Reset form
    form.value = {
      nombre_completo: '',
      especialidad: '',
      estado_id: null,
      municipio_id: null,
      parroquia_id: null,
      dispone_transporte: false,
      tiene_insumos: false,
      telefono: ''
    }
  } catch (err: any) {
    console.error('Error al registrar voluntario:', err)
    errorMsg.value = `Error: ${err.message || 'No se pudo procesar el registro.'}`
  } finally {
    loading.value = false
  }
}
</script>

<template>
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

    <!-- Datos Personales (Ancho completo y help) -->
    <UFormField label="Nombre y Apellido" required help="Ingrese su nombre completo de contacto.">
      <UInput
        v-model="form.nombre_completo"
        placeholder="Ej. Dr. Carlos Silva"
        class="w-full text-neutral-800"
      />
    </UFormField>

    <UFormField label="Especialidad / Rol" required help="Seleccione su especialidad principal para asignación en el terreno.">
      <USelectMenu
        v-model="form.especialidad"
        :items="especialidades"
        placeholder="Seleccione Especialidad"
        value-key="value"
        class="w-full text-neutral-800"
      />
    </UFormField>

    <!-- Ubicación (Ancho completo y help) -->
    <UFormField label="Estado de Disponibilidad" required help="Estado donde puede prestar apoyo.">
      <USelectMenu
        v-model="form.estado_id"
        :items="estados"
        placeholder="Seleccione"
        class="w-full text-neutral-800"
        value-key="value"
        @update:modelValue="onEstadoChange"
      />
    </UFormField>

    <UFormField label="Municipio" required help="Municipio de disponibilidad.">
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

    <UFormField label="Parroquia" required help="Parroquia o sector donde se encuentra.">
      <USelectMenu
        v-model="form.parroquia_id"
        :items="parroquias"
        placeholder="Seleccione"
        value-key="value"
        :disabled="!form.municipio_id"
        class="w-full text-neutral-800"
      />
    </UFormField>

    <!-- Movilidad e Insumos -->
    <div class="space-y-3 border-t border-neutral-200 pt-4">
      <h4 class="text-xs font-bold text-neutral-600 uppercase tracking-wider">Movilidad y Recursos</h4>
      <div class="space-y-2">
        <UCheckbox
          v-model="form.dispone_transporte"
          label="Dispongo de vehículo / moto para trasladarme"
          class="text-xs text-neutral-600 font-medium"
        />
        <UCheckbox
          v-model="form.tiene_insumos"
          label="Tengo insumos médicos propios (botiquín, equipos, etc.)"
          class="text-xs text-neutral-600 font-medium"
        />
      </div>
    </div>

    <!-- Contacto -->
    <div class="border-t border-neutral-200 pt-4">
      <UFormField label="Teléfono Celular Principal" required>
        <UInput
          v-model="form.telefono"
          placeholder="Ej: 04121234567"
          inputmode="numeric"
          pattern="[0-9]*"
          class="w-full text-neutral-800"
        />
      </UFormField>
    </div>

    <!-- Botón Enviar integrado -->
    <div class="pt-4 border-t border-neutral-200">
      <UButton
        color="primary"
        variant="solid"
        size="lg"
        :loading="loading"
        icon="i-lucide-user-plus"
        class="w-full justify-center py-3 font-bold cursor-pointer"
        @click="registrarVoluntario"
      >
        Registrarme como Voluntario Activo
      </UButton>
    </div>
  </div>
</template>
