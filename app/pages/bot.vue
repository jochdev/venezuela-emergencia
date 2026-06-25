<script setup lang="ts">
import { ref } from 'vue'

useHead({
  title: 'Guía del Bot de Telegram - Red de Apoyo y Emergencia',
  meta: [
    { name: 'description', content: 'Guía de uso del Bot de Telegram oficial para consultas de estatus y alertas automáticas.' }
  ]
})
</script>

<template>
  <div class="py-8 px-4 max-w-4xl mx-auto space-y-12 bg-white text-neutral-800">
    <UPageHero 
      title="Bot de Telegram Oficial"
      description="Consulta en tiempo real el estatus de familiares o personas reportadas con el mínimo consumo de datos móviles."
      class="py-4"
    >
      <template #links>
        <UButton 
          color="primary" 
          size="lg"
          to="https://t.me/emergencia_jochdev_bot"
          target="_blank"
          icon="i-lucide-send"
        >
          Ir al Bot de Telegram
        </UButton>
      </template>
    </UPageHero>

    <UCard>
      <div class="space-y-6 prose prose-neutral max-w-none prose-h2:text-primary">
        <h2>¿Por qué usar nuestro Bot?</h2>
        <p>
          En situaciones de emergencia donde la conectividad o los datos móviles son limitados, Telegram gestiona las conexiones de manera mucho más eficiente que un navegador web convencional. Nuestro bot te permite realizar consultas exactas y recibir alertas inmediatas sin depender de una página abierta.
        </p>

        <hr class="border-neutral-200">

        <h2>1. ¿Cómo realizar una consulta?</h2>
        <p>
          El bot ha sido diseñado para ser extremadamente rápido y directo. <strong>No necesitas navegar por menús complicados.</strong>
        </p>
        <ol>
          <li>Abre el chat con el bot y presiona <strong>"Iniciar"</strong>.</li>
          <li>Escribe <strong>únicamente el número de cédula</strong> de la persona que buscas. 
            <br><span class="text-neutral-500 text-sm">No te preocupes por los puntos, espacios o si colocas la 'V-' al inicio; el bot limpiará el formato automáticamente para buscar la coincidencia exacta.</span>
          </li>
          <li>Presiona <strong>Enviar</strong>.</li>
        </ol>

        <p><strong>¿Qué te responderá el bot?</strong></p>
        <ul>
          <li><strong>Si hay registros:</strong> Recibirás el nombre completo, el estatus actual (Ej: <em>En Refugio, Atendido</em>), todo el historial de movimientos de esa persona y un botón directo para abrir Google Maps con la ubicación exacta del <strong>Refugio o Centro Médico</strong> oficial donde se encuentra resguardado (por privacidad, nunca se enviarán direcciones residenciales).</li>
          <li><strong>Si no hay registros:</strong> El bot te informará que aún no hay información asociada a esa cédula.</li>
        </ul>

        <hr class="border-neutral-200">

        <h2>2. Suscribirse a Alertas Automáticas 🔔</h2>
        <p>
          Esta es la herramienta más importante. Sabemos lo difícil que es la incertidumbre, por lo que hemos automatizado el sistema para avisarte apenas sepamos algo nuevo.
        </p>
        <ol>
          <li>Al realizar la consulta de una cédula, debajo de la respuesta aparecerá el botón <strong>"🔔 Suscribirme a actualizaciones"</strong>.</li>
          <li><strong>Púlsalo.</strong> Recibirás un aviso de confirmación.</li>
          <li>En el momento exacto en que un paramédico o rescatista registre nueva información de esa persona, <strong>el bot te enviará un mensaje automático e inmediato a tu celular</strong> con todos los detalles nuevos.</li>
        </ol>
        <p class="text-sm text-neutral-500 italic">
          Si deseas dejar de recibir alertas, vuelve a enviar la cédula y presiona "🔕 Cancelar suscripción".
        </p>

        <hr class="border-neutral-200">

        <h2>Preguntas Frecuentes</h2>
        
        <div class="space-y-4">
          <div>
            <h4 class="font-bold text-neutral-900">¿Por qué el bot solo acepta números de cédula y no nombres?</h4>
            <p class="text-sm text-neutral-700">Para evitar confusiones con nombres similares o apellidos muy comunes (homónimos) y garantizar que la información sensible corresponda exactamente a tu familiar. Si no conoces la cédula, por favor utiliza el buscador por nombres directamente en nuestra web pública <a href="https://emergencia.joch.dev" class="text-primary font-medium hover:underline">emergencia.joch.dev</a>.</p>
          </div>
          <div>
            <h4 class="font-bold text-neutral-900">Envié un mensaje y dice que he excedido el límite, ¿qué significa?</h4>
            <p class="text-sm text-neutral-700">Para proteger la plataforma de caídas y mantenerla activa para todos los ciudadanos, el bot tiene una medida de seguridad. Si envías más de 5 mensajes en menos de un minuto, el bot te pausará temporalmente. Solo espera 60 segundos y podrás volver a consultar sin problema.</p>
          </div>
        </div>

      </div>
    </UCard>
    
    <div class="flex justify-center pb-8">
      <UButton 
        color="neutral" 
        variant="ghost" 
        to="/"
        icon="i-lucide-arrow-left"
      >
        Volver a la página principal
      </UButton>
    </div>
  </div>
</template>
