<script setup lang="ts">
useHead({
  title: 'Acerca del Proyecto - Emergencias Venezuela'
})
</script>

<template>
  <UContainer class="py-8">
    <UCard class="max-w-4xl mx-auto shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800">
      <div class="space-y-6 text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
        
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Acerca del Sistema y Manual para Autoridades</h1>
          <p>Bienvenido al panel de control del <strong class="font-semibold text-neutral-900 dark:text-white">Sistema de Gestión de Emergencias de Venezuela</strong>. Esta plataforma permite a los organismos de seguridad, protección civil, bomberos y centros de asistencia coordinar y atender en tiempo real las incidencias reportadas por la ciudadanía.</p>
          <p class="mt-2">A continuación, encontrarás una guía rápida sobre cómo navegar y operar dentro del sistema.</p>
        </div>
        
        <UDivider class="my-6" />
        
        <section>
          <h2 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">1. Arquitectura de Enlaces y Dominios del Sistema</h2>
          <p class="mb-4">Para garantizar la estabilidad de la red bajo alta demanda y resguardar la confidencialidad de las operaciones, el ecosistema se divide estrictamente en dos plataformas independientes:</p>
          <ul class="list-disc list-inside space-y-3 ml-2 mb-6">
            <li><span class="mr-1">🌐</span> <strong class="font-semibold text-neutral-900 dark:text-white">Plataforma Pública (<a href="https://emergencia.joch.dev" target="_blank" class="text-primary hover:underline">https://emergencia.joch.dev</a>):</strong> El sitio web de libre acceso donde la población general puede ingresar reportes de víctimas y consultar de forma segura si un familiar ha sido localizado.</li>
            <li><span class="mr-1">🔐</span> <strong class="font-semibold text-neutral-900 dark:text-white">Panel Operativo (<a href="https://control-emergencia.joch.dev" target="_blank" class="text-primary hover:underline">https://control-emergencia.joch.dev</a>):</strong> El portal exclusivo de uso oficial para las autoridades. <strong class="font-semibold text-neutral-900 dark:text-white">Este manual describe el funcionamiento interno de este dominio en específico.</strong></li>
          </ul>
        </section>

        <UDivider class="my-6" />

        <section>
          <h2 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">2. Acceso y Validación en el Panel Operativo</h2>
          <p class="mb-4">Para resguardar la seguridad del país y la privacidad de las víctimas, el acceso a la plataforma de control está estrictamente restringido.</p>
          
          <h3 class="text-lg font-bold text-neutral-900 dark:text-white mb-2">¿Cómo ingresar al panel de control?</h3>
          <ol class="list-decimal list-inside space-y-2 ml-2 mb-6">
            <li>Ingresa a la página oficial de control: <strong class="font-semibold"><a href="https://control-emergencia.joch.dev" target="_blank" class="text-primary hover:underline">https://control-emergencia.joch.dev</a></strong>.</li>
            <li>Introduce tu Correo Electrónico institucional o registrado.</li>
            <li>El sistema te enviará un <strong class="font-semibold text-neutral-900 dark:text-white">Código de Acceso Operativo (Token de un solo uso)</strong> a tu bandeja de entrada.</li>
            <li>Introduce el código de 6 dígitos en la pantalla para iniciar sesión de forma segura.</li>
          </ol>
          
          <UAlert
            icon="i-lucide-alert-triangle"
            color="warning"
            variant="soft"
            title="Atención"
            description="Tu cuenta debe ser dada de alta previamente por el Administrador General (jochdev). Los operadores no pueden autorregistrarse públicamente para evitar infiltraciones en la base de datos confidencial. Si tu organismo aún no está registrado, solicita el alta enviando una credencial oficial a hola@joch.dev."
          />
        </section>

        <UDivider class="my-6" />

        <section>
          <h2 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">3. Roles, Permisos y Cobertura Geográfica</h2>
          <p class="mb-4">El sistema implementa un modelo de <strong class="font-semibold text-neutral-900 dark:text-white">Control de Acceso Basado en Roles (RBAC)</strong> y delimitación territorial para evitar la saturación de información:</p>
          <ul class="list-disc list-inside space-y-3 ml-2">
            <li><strong class="font-semibold text-neutral-900 dark:text-white">Administrador (jochdev / Admin):</strong> Tiene control total. Es el único rol autorizado para crear organismos, registrar operadores, ver la <strong class="font-semibold text-neutral-900 dark:text-white">Bitácora de Auditoría</strong> global y reasignar coberturas.</li>
            <li><strong class="font-semibold text-neutral-900 dark:text-white">Operador:</strong> Usuario encargado del monitoreo en tiempo real. Su visibilidad está estrictamente limitada por la <strong class="font-semibold text-neutral-900 dark:text-white">cobertura geográfica</strong> configurada en su perfil por el Administrador:
              <ul class="list-circle list-inside ml-6 mt-2 space-y-1 text-sm">
                <li><strong class="font-semibold text-neutral-900 dark:text-white">Nivel Estado:</strong> Visualiza y gestiona incidentes de todo ese Estado.</li>
                <li><strong class="font-semibold text-neutral-900 dark:text-white">Nivel Municipio:</strong> Su bandeja se limita únicamente a los reportes de ese municipio.</li>
                <li><strong class="font-semibold text-neutral-900 dark:text-white">Nivel Parroquia:</strong> Solo interactúa con datos y reportes de esa parroquia específica.</li>
              </ul>
            </li>
          </ul>
        </section>

        <UDivider class="my-6" />

        <section>
          <h2 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">4. Módulos Principales (Diseño en una Sola Página)</h2>
          <p class="mb-6">La interfaz opera en una sola pantalla de alto rendimiento. Puedes alternar de inmediato entre módulos usando las pestañas superiores:</p>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                <UIcon name="i-lucide-alert-circle" class="text-error size-5" />
                Bandeja de Incidentes (Triage en Tiempo Real)
              </h3>
              <p class="mb-2">Visualiza los reportes urgentes emitidos por los ciudadanos. El sistema prioriza automáticamente las filas por severidad visual:</p>
              <ul class="list-disc list-inside ml-2 space-y-1">
                <li><strong class="font-semibold text-error">Prioridad 1 (Rojo):</strong> Personas atrapadas o heridas en estructuras colapsadas. Requiere despacho inmediato.</li>
                <li><strong class="font-semibold text-warning">Prioridad 2 (Naranja):</strong> Personas desaparecidas.</li>
                <li><strong class="font-semibold text-neutral-900 dark:text-white">Derivar Caso:</strong> Si el incidente requiere apoyo de otra jurisdicción u organismo nacional, puedes actualizar el territorio asignado para transferir el caso instantáneamente a la bandeja del operador competente en tiempo real.</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                <UIcon name="i-lucide-search" class="text-primary size-5" />
                Búsqueda de Familiares
              </h3>
              <p>Permite gestionar y verificar el estatus de los ciudadanos. Cuando un operador localiza a una persona en el terreno, actualiza su estado a <strong class="font-semibold text-neutral-900 dark:text-white">"A salvo"</strong> y le asigna el <strong class="font-semibold text-neutral-900 dark:text-white">Refugio</strong> correspondiente. Esto permite que el buscador público web responda de inmediato a los familiares con el paradero exacto, resguardando datos sensibles.</p>
            </div>

            <div>
              <h3 class="text-lg font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                <UIcon name="i-lucide-home" class="text-primary size-5" />
                Refugios de Emergencia
              </h3>
              <p class="mb-2">Directorio dinámico de los espacios provisionales habilitados (escuelas, iglesias, plazas).</p>
              <ul class="list-disc list-inside ml-2 space-y-1">
                <li><strong class="font-semibold text-neutral-900 dark:text-white">Control de Ocupación:</strong> Los operadores deben mantener actualizada la <strong class="font-semibold text-neutral-900 dark:text-white">población actual</strong> frente a la capacidad máxima del sitio para evitar el hacinamiento y coordinar desvíos de traslados.</li>
                <li><strong class="font-semibold text-neutral-900 dark:text-white">Insumos Urgentes:</strong> Espacio para listar carencias críticas (agua, colchonetas, medicinas) que se sincroniza automáticamente con el módulo de acopio.</li>
              </ul>
            </div>

            <div>
              <h3 class="text-lg font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                <UIcon name="i-lucide-package" class="text-primary size-5" />
                Centros de Acopio y Voluntariado Médico
              </h3>
              <ul class="list-disc list-inside ml-2 space-y-1">
                <li><strong class="font-semibold text-neutral-900 dark:text-white">Acopio:</strong> Gestión de puntos de donación de la sociedad civil. Solo los centros aprobados y marcados como <strong class="font-semibold text-neutral-900 dark:text-white">"Verificados"</strong> se muestran en la web pública para evitar desvíos o desinformación.</li>
                <li><strong class="font-semibold text-neutral-900 dark:text-white">Médicos:</strong> Base de datos confidencial de profesionales de la salud disponibles (médicos, paramédicos, psicólogos) ordenados por su ubicación actual para asignación rápida en refugios o zonas de triaje.</li>
              </ul>
            </div>
          </div>
        </section>

        <UDivider class="my-6" />

        <section>
          <h2 class="text-2xl font-bold text-neutral-900 dark:text-white mb-4">5. Seguridad, Privacidad y Bitácora de Auditoría</h2>
          <p class="mb-4">Cada acción dentro de la plataforma queda registrada de forma inmutable.</p>
          <ul class="list-disc list-inside space-y-2 ml-2">
            <li><strong class="font-semibold text-neutral-900 dark:text-white">Bitácora (logs_auditoria):</strong> El sistema guarda automáticamente un registro con el nombre del operador, hora exacta, dirección IP y el cambio realizado (ej. <em class="text-neutral-500">"Modificó estatus de víctima de Desaparecido a A Salvo"</em> o <em class="text-neutral-500">"Consultó dirección exacta"</em>), garantizando la transparencia absoluta del manejo de la crisis.</li>
            <li><strong class="font-semibold text-neutral-900 dark:text-white">Campos Protegidos:</strong> Por motivos de seguridad institucional, los operadores pueden visualizar sus datos de identificación (DNI/Cédula y Organismo) pero <strong class="font-semibold text-neutral-900 dark:text-white">no pueden editarlos</strong>. Solo están autorizados a gestionar sus credenciales de acceso.</li>
          </ul>
        </section>

        <UDivider class="my-6" />

        <section class="bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-xl border border-neutral-100 dark:border-neutral-800">
          <h2 class="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-heart-handshake" class="size-6" />
            6. Manifiesto y Apoyo al Proyecto
          </h2>
          <p class="mb-4">Esta es una <strong class="font-semibold text-neutral-900 dark:text-white">iniciativa ciudadana independiente de código abierto</strong> para facilitar la localización de personas y coordinar apoyo. Los datos recopilados se pondrán a disposición de los cuerpos de rescate oficiales (Protección Civil, Bomberos, Cruz Roja) para agilizar las labores de búsqueda y salvamento.</p>
          
          <p class="mb-4">La infraestructura es financiada de forma privada y solidaria. En el momento en que una autoridad u organismo competente asuma la gestión, <strong class="font-semibold text-primary">Jochdev</strong> transferirá por completo el sistema y las bases de datos a las instituciones pertinentes, procediendo a la posterior destrucción de los respaldos temporales privados para proteger la privacidad de la ciudadanía.</p>
        </section>
      </div>
    </UCard>
  </UContainer>
</template>
