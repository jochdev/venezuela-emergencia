import venezuelaData from '../../db/venezuela.json'

export default defineEventHandler((event) => {
  // Opcional: Configurar caché para mejorar el rendimiento
  defaultContentType(event, 'application/json')
  return venezuelaData
})
