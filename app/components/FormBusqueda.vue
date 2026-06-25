<script setup lang="ts">
import { ref, computed } from 'vue'
import { VENEZUELA_UBICACIONES } from '~/utils/venezuelaData'
import { useSupabase } from '~/utils/supabase'

const emit = defineEmits(['success'])

const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const form = ref({
  nombre_buscado: '',
  cedula_buscado: '',
  estado_ultimo_visto: null as number | null,
  detalles_adicionales: '',
  quien_busca_contacto: ''
})

const estados = computed(() => {
  return VENEZUELA_UBICACIONES.map(e => ({ label: e.nombre, value: e.id }))
})

const submitBusqueda = async () => {
  if (!form.value.nombre_buscado || !form.value.quien_busca_contacto) {
    errorMsg.value = 'Por favor complete el nombre de la persona buscada y sus datos de contacto.'
    return
  }
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const supabase = useSupabase()
    const { error } = await supabase.from('busqueda_familiares').insert([
      {
        nombre_buscado: form.value.nombre_buscado,
        cedula_buscado: form.value.cedula_buscado || null,
        estado_ultimo_visto: form.value.estado_ultimo_visto ? Number(form.value.estado_ultimo_visto) : null,
        detalles_adicionales: form.value.detalles_adicionales || null,
        quien_busca_contacto: form.value.quien_busca_contacto
      }
    ])

    if (error) throw error

    successMsg.value = '¡Registro de búsqueda publicado exitosamente!'
    form.value = {
      nombre_buscado: '',
      cedula_buscado: '',
      estado_ultimo_visto: null,
      detalles_adicionales: '',
      quien_busca_contacto: ''
    }
    emit('success')
  } catch (err: any) {
    console.error('Error al guardar búsqueda:', err)
    errorMsg.value = `Error: ${err.message || 'No se pudo guardar la búsqueda. Verifique la conexión.'}`
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard class="w-full max-w-xl mx-auto shadow-xl bg-neutral-900 border border-neutral-800">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-users" class="text-primary size-6" />
        <h2 class="text-xl font-bold text-highlighted">Buscar a un Familiar</h2>
      </div>
      <p class="text-xs text-muted mt-1">Registra los datos de la persona desaparecida para alertar a la comunidad y autoridades.</p>
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

      <UFormField label="Nombre de la Persona Buscada" required>
        <UInput
          v-model="form.nombre_buscado"
          placeholder="Nombre y Apellidos de tu familiar"
          class="w-full"
        />
      </UFormField>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <UFormField label="Cédula de Identidad (Recomendado)">
          <UInput
            v-model="form.cedula_buscado"
            placeholder="Ej. V-12345678"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Último Estado donde fue Visto">
          <USelect
            v-model="form.estado_ultimo_visto"
            :items="estados"
            placeholder="Seleccione Estado"
            value-key="value"
            class="w-full"
          />
        </UFormField>
      </div>

      <UFormField label="Detalles Adicionales / Última información conocida">
        <UTextarea
          v-model="form.detalles_adicionales"
          placeholder="Describa vestimenta, señas particulares o el último mensaje recibido: 'Estaba en el sector La Esmeralda cuando comenzó la lluvia. Vestía camisa azul.'"
          rows="3"
          class="w-full"
        />
      </UFormField>

      <div class="border-t border-neutral-800 pt-4 space-y-4">
        <h3 class="text-sm font-bold text-neutral-300">Tus Datos de Contacto</h3>
        <UFormField label="Tu Nombre y Teléfono / Redes" required>
          <UInput
            v-model="form.quien_busca_contacto"
            placeholder="Ej. María Gómez (Madre) - Tel: 0414-7654321"
            class="w-full"
          />
        </UFormField>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          color="primary"
          variant="solid"
          size="lg"
          :loading="loading"
          icon="i-lucide-plus"
          class="w-full md:w-auto"
          @click="submitBusqueda"
        >
          Publicar Búsqueda
        </UButton>
      </div>
    </template>
  </UCard>
</template>
