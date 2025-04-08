import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const createClient = (): SupabaseClient<Database> => {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Singleton typé correctement
let clientInstance: SupabaseClient<Database> | null = null

export const getClientInstance = () => {
  if (!clientInstance) {
    clientInstance = createClient()
  }
  return clientInstance
}
