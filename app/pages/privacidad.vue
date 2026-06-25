<script setup lang="ts">
// Página estática de política de privacidad
</script>

<template>
  <div class="py-8 px-4 max-w-3xl mx-auto space-y-6 bg-white text-neutral-800">
    <UButton
      to="/"
      color="primary"
      variant="ghost"
      icon="i-lucide-arrow-left"
      class="mb-2 cursor-pointer"
    >
      Volver al Inicio
    </UButton>

    <UCard class="shadow-sm border border-neutral-200 bg-neutral-50 p-6 space-y-6">
      <template #header>
        <h1 class="text-2xl font-bold text-neutral-900">Política de Privacidad y Manejo de Datos de Emergencia</h1>
        <p class="text-xs text-neutral-500 mt-1">Última actualización: Junio 2026</p>
      </template>

      <div class="space-y-4 text-sm text-neutral-700 leading-relaxed">
        <p>
          Este sitio web (<strong class="text-neutral-900">emergencia.joch.dev</strong>) es una iniciativa ciudadana e independiente de código abierto, desarrollada con el único propósito de apoyar las labores de rescate, localización de personas y coordinación de ayuda humanitaria tras el sismo reciente en Venezuela.
        </p>
        <p>
          Al registrar información en esta plataforma, aceptas el manejo de los datos bajo las siguientes condiciones de estricta seguridad:
        </p>

        <hr class="border-neutral-200 my-4" />

        <div class="space-y-3">
          <h2 class="font-bold text-neutral-900 flex items-center gap-1.5">
            <UIcon name="i-lucide-database" class="text-primary-500" />
            1. ¿Qué datos recopilamos y para qué?
          </h2>
          <ul class="list-disc list-inside space-y-2 pl-2 text-xs md:text-sm">
            <li>
              <strong>Reportes de Víctimas/Afectados:</strong> Recopilamos nombres, ubicación geográfica y estados de salud con el único fin de canalizarlos de forma prioritaria a los cuerpos de rescate oficiales (Protección Civil, Bomberos, Cruz Roja).
            </li>
            <li>
              <strong>Búsqueda de Familiares:</strong> Recopilamos nombres y números de cédula para permitir que familiares confirmen si una persona ha sido reportada "A salvo".
            </li>
            <li>
              <strong>Voluntariado Médico y Puntos de Acopio:</strong> Recopilamos datos de contacto y ubicación para coordinar la logística de ayuda en las zonas afectadas.
            </li>
          </ul>
        </div>

        <div class="space-y-3 pt-2">
          <h2 class="font-bold text-neutral-900 flex items-center gap-1.5">
            <UIcon name="i-lucide-lock" class="text-primary-500" />
            2. Privacidad y Acceso Restringido (Quién ve los datos)
          </h2>
          <p class="text-xs md:text-sm">
            La data sensible <strong>NO es pública</strong>. Las direcciones exactas, números de teléfono de informantes y listas de personal de salud están protegidos y solo son accesibles por las autoridades de rescate legítimas mediante un acceso administrativo cifrado.
          </p>
          <p class="text-xs md:text-sm">
            El buscador público de familiares solo confirmará el estatus de una persona ("A salvo" / "En refugio") si se introduce la coincidencia exacta de Cédula o Nombre, protegiendo su ubicación exacta y datos de contacto.
          </p>
        </div>

        <div class="space-y-3 pt-2">
          <h2 class="font-bold text-neutral-900 flex items-center gap-1.5">
            <UIcon name="i-lucide-map-pin" class="text-primary-500" />
            3. Uso de la Geolocalización
          </h2>
          <p class="text-xs md:text-sm">
            La geolocalización por GPS se activa únicamente si el usuario presiona voluntariamente el botón "Compartir mi GPS actual". Estos datos se usan exclusivamente para enviar coordenadas precisas a las cuadrillas de rescate en el terreno.
          </p>
        </div>

        <div class="space-y-3 pt-2">
          <h2 class="font-bold text-neutral-900 flex items-center gap-1.5">
            <UIcon name="i-lucide-trash-2" class="text-primary-500" />
            4. Compromiso de Eliminación de Datos (Destrucción de la data)
          </h2>
          <p class="text-xs md:text-sm">
            <strong>Esta plataforma es temporal.</strong> Nos comprometemos formalmente a eliminar de forma permanente y definitiva todas las bases de datos recopiladas en este sitio una vez que la fase de contingencia concluya y las autoridades oficiales hayan estabilizado las operaciones de búsqueda y rescate. No comercializaremos, cederemos ni retendremos estos datos para ningún uso futuro.
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>
