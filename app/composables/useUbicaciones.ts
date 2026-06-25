import { ref } from 'vue'

export interface Parroquia {
  id: number
  nombre: string
}

export interface Municipio {
  id: number
  nombre: string
  parroquias: Parroquia[]
}

export interface Estado {
  id: number
  nombre: string
  municipios: Municipio[]
}

export const useUbicaciones = async () => {
  const { data, error } = await useFetch<any[]>('/api/venezuela', {
    key: 'venezuela-ubicaciones',
    transform: (data) => {
      if (!data) return []
      return data.map((e: any) => ({
        id: e.id,
        nombre: e.estado,
        iso: e.iso,
        municipios: (e.municipios || []).map((m: any) => ({
          id: m.id,
          nombre: m.municipio,
          parroquias: (m.parroquias || []).map((p: any) => ({
            id: p.id,
            nombre: p.parroquia
          }))
        }))
      }))
    }
  })

  return {
    ubicaciones: data,
    error
  }
}
