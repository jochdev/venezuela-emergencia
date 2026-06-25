import { createClient } from '@supabase/supabase-js'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const key = config.public.supabaseKey as string

  return createClient(url || 'https://placeholder.supabase.co', key || 'placeholder')
}
export type SupabaseClientType = ReturnType<typeof useSupabase>
