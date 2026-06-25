import { serverSupabaseClient } from '#supabase/server'

// Limite en memoria (Cache) para evitar saturar la API
const rateLimit = new Map<number, { count: number, resetAt: number }>()
const MAX_REQUESTS = 5 // Max 5 peticiones
const WINDOW_MS = 60 * 1000 // Por minuto

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const botToken = config.telegramBotToken

  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN no está configurado')
    return { ok: false, error: 'Token no configurado' }
  }

  const body = await readBody(event)
  console.log('[Telegram Webhook] Mensaje recibido:', body?.message?.text || body?.callback_query?.data || 'Otro tipo de evento')

  // Extraer el chatId para el Rate Limit
  let chatId = null
  if (body?.message?.chat?.id) chatId = body.message.chat.id
  else if (body?.callback_query?.message?.chat?.id) chatId = body.callback_query.message.chat.id

  // Aplicar Rate Limiting
  if (chatId) {
    const now = Date.now()
    const limitData = rateLimit.get(chatId)
    
    if (limitData && now < limitData.resetAt) {
      limitData.count++
      if (limitData.count > MAX_REQUESTS) {
        if (limitData.count === MAX_REQUESTS + 1) {
          // Avisar una única vez que se excedió el límite
          const botTokenLimit = config.telegramBotToken
          $fetch(`https://api.telegram.org/bot${botTokenLimit}/sendMessage`, {
            method: 'POST',
            body: { chat_id: chatId, text: '⚠️ Has excedido el límite de consultas. Por favor, espera un minuto.' }
          }).catch(e => console.error(e))
        }
        return { ok: true, message: 'Rate limited' } // Salir silenciosamente para no saturar más
      }
    } else {
      // Nueva ventana de tiempo para este usuario
      rateLimit.set(chatId, { count: 1, resetAt: now + WINDOW_MS })
    }
  }

  // Función auxiliar para enviar mensajes a Telegram
  const sendMessage = async (chat_id: number, text: string, reply_markup?: any) => {
    await $fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      body: { chat_id, text, parse_mode: 'HTML', reply_markup }
    }).catch(e => console.error('Error enviando a Telegram:', e))
  }

  // Función para responder a callback queries
  const answerCallbackQuery = async (callback_query_id: string, text: string) => {
    await $fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
      method: 'POST',
      body: { callback_query_id, text, show_alert: true }
    }).catch(e => console.error('Error en callback:', e))
  }

  // Función para editar el mensaje con el nuevo teclado
  const editMessageReplyMarkup = async (chat_id: number, message_id: number, reply_markup: any) => {
    await $fetch(`https://api.telegram.org/bot${botToken}/editMessageReplyMarkup`, {
      method: 'POST',
      body: { chat_id, message_id, reply_markup }
    }).catch(e => console.error('Error editando teclado:', e))
  }

  try {
    const supabase = await serverSupabaseClient<any>(event)

    // Manejo de botones interactivos (Suscripciones)
    if (body.callback_query) {
      const callbackId = body.callback_query.id
      const data = body.callback_query.data
      const chatId = body.callback_query.message.chat.id
      const messageId = body.callback_query.message.message_id

      if (data.startsWith('sub_') || data.startsWith('unsub_')) {
        const accion = data.split('_')[0]
        const cedula = data.split('_')[1]

        if (accion === 'sub') {
          await supabase.from('telegram_suscripciones').upsert({ chat_id: chatId, cedula }, { onConflict: 'chat_id, cedula' })
          await answerCallbackQuery(callbackId, '✅ Te has suscrito a las actualizaciones de esta cédula.')
          
          // Cambiar botón a cancelar
          const reply_markup = body.callback_query.message.reply_markup
          if (reply_markup && reply_markup.inline_keyboard) {
            reply_markup.inline_keyboard[reply_markup.inline_keyboard.length - 1] = [{
              text: '🔕 Cancelar suscripción',
              callback_data: `unsub_${cedula}`
            }]
            await editMessageReplyMarkup(chatId, messageId, reply_markup)
          }
        } else if (accion === 'unsub') {
          await supabase.from('telegram_suscripciones').delete().match({ chat_id: chatId, cedula })
          await answerCallbackQuery(callbackId, '🔕 Has cancelado tu suscripción a esta cédula.')
          
          // Cambiar botón a suscribir
          const reply_markup = body.callback_query.message.reply_markup
          if (reply_markup && reply_markup.inline_keyboard) {
            reply_markup.inline_keyboard[reply_markup.inline_keyboard.length - 1] = [{
              text: '🔔 Suscribirme a actualizaciones',
              callback_data: `sub_${cedula}`
            }]
            await editMessageReplyMarkup(chatId, messageId, reply_markup)
          }
        }
      }
      return { ok: true }
    }

    if (!body || !body.message || !body.message.text) {
      return { ok: true }
    }

    const chatId = body.message.chat.id
    let text = body.message.text.trim().toUpperCase()

    // Manejar comandos básicos
    if (text === '/START' || text === '/AYUDA') {
      const mensajeBienvenida = `🇻🇪 <b>Red de Apoyo y Emergencia</b>\n\nEste bot te permite consultar el estatus de personas reportadas en la contingencia.\n\n👉 <b>¿Cómo funciona?</b>\nSimplemente envíame un número de cédula (Ejemplo: <code>V-12345678</code> o <code>12345678</code>) y te devolveré su última ubicación conocida y su línea de tiempo.\n\n🔔 <b>Suscripciones:</b>\nAl consultar una cédula, tendrás la opción de suscribirte. Si lo haces, te enviaremos un mensaje automático tan pronto como un operador actualice la información de esa persona.`
      await sendMessage(chatId, mensajeBienvenida)
      return { ok: true }
    }

    const cedulaRegex = /^[VEJ]?\-?\d{5,9}$/
    
    if (!cedulaRegex.test(text)) {
      await sendMessage(chatId, '🇻🇪 <b>Red de Apoyo y Emergencia</b>\n\nPor favor, envíe un número de cédula válido para consultar (Ejemplo: <code>V-12345678</code> o <code>12345678</code>).')
      return { ok: true }
    }

    const digitos = text.replace(/\D/g, '')
    
    // Buscar en busqueda_familiares
    const { data: dataBusqueda } = await supabase
      .from('busqueda_familiares')
      .select('*, bitacora_casos(*)')
      .or(`cedula_buscado.ilike.%${digitos}%`)
      .limit(5)

    // Buscar en reportes_emergencias
    const { data: dataReportes } = await supabase
      .from('reportes_emergencias')
      .select('*, bitacora_incidentes(*, refugios(nombre_refugio, latitud, longitud), centros_medicos(nombre, latitud, longitud))')
      .ilike('detalles_emergencia', `%${digitos}%`)
      .limit(5)

    const resultados = []

    if (dataBusqueda && dataBusqueda.length > 0) {
      dataBusqueda.forEach(b => {
        resultados.push({
          tipo: 'busqueda',
          nombre: b.nombre_buscado,
          estatus: b.estatus,
          direccion: b.ubicacion_actual || b.detalles_adicionales,
          bitacora: b.bitacora_casos ? b.bitacora_casos.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : []
        })
      })
    }

    if (dataReportes && dataReportes.length > 0) {
      dataReportes.forEach(r => {
        resultados.push({
          tipo: 'reporte',
          nombre: r.nombre_completo,
          estatus: r.estado_persona,
          direccion: r.direccion_exacta,
          bitacora: r.bitacora_incidentes ? r.bitacora_incidentes.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : []
        })
      })
    }

    if (resultados.length === 0) {
      await sendMessage(chatId, `No se encontraron registros asociados a la cédula <b>${text}</b> en nuestra base de datos.`)
      return { ok: true }
    }

    // Comprobar si ya está suscrito
    const { data: suscripcion } = await supabase
      .from('telegram_suscripciones')
      .select('id')
      .match({ chat_id: chatId, cedula: digitos })
      .single()

    const estaSuscrito = !!suscripcion

    // Construir la respuesta
    for (const reg of resultados) {
      let mensaje = `👤 <b>${reg.nombre || 'Persona sin identificar'}</b>\n`
      mensaje += `📌 Estatus: <b>${reg.estatus}</b>\n`
      if (reg.direccion) {
        mensaje += `📍 Referencia: ${reg.direccion}\n`
      }
      mensaje += `\n🗓 <b>Línea de Tiempo:</b>\n`

      let inline_keyboard = []

      if (reg.bitacora && reg.bitacora.length > 0) {
        reg.bitacora.forEach((log: any) => {
          const fecha = new Date(log.created_at).toLocaleString('es-VE')
          const estatusLog = log.estatus || log.estado_persona
          mensaje += `\n🔹 <i>${fecha}</i> - <b>${estatusLog}</b>\n`
          mensaje += `   ${log.detalles}\n`

          let lat = null, lng = null, lugar = ''
          if (log.ubicacion_actual) mensaje += `   Ubicación: ${log.ubicacion_actual}\n`
          if (log.refugios) {
            lugar = log.refugios.nombre_refugio; lat = log.refugios.latitud; lng = log.refugios.longitud
            mensaje += `   Lugar: ${lugar}\n`
          } else if (log.centros_medicos) {
            lugar = log.centros_medicos.nombre; lat = log.centros_medicos.latitud; lng = log.centros_medicos.longitud
            mensaje += `   Lugar: ${lugar}\n`
          }

          if (lat && lng) {
            inline_keyboard.push([{ text: `🗺 Ver ${lugar || 'Ubicación'} en Mapa`, url: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` }])
          }
        })
      } else {
        mensaje += `No hay actualizaciones en la bitácora.\n`
      }

      // Añadir botón de suscripción al final del teclado
      if (estaSuscrito) {
        inline_keyboard.push([{ text: '🔕 Cancelar suscripción', callback_data: `unsub_${digitos}` }])
      } else {
        inline_keyboard.push([{ text: '🔔 Suscribirme a actualizaciones', callback_data: `sub_${digitos}` }])
      }

      const reply_markup = inline_keyboard.length > 0 ? { inline_keyboard } : undefined
      await sendMessage(chatId, mensaje, reply_markup)
    }
  } catch (error) {
    console.error('Error en webhook de telegram:', error)
    // El chat ID puede no estar definido si el error ocurrió antes de extraerlo, pero ignoramos el send si falla
  }

  return { ok: true }
})
