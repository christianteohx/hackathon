import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function makeSupabase(): SupabaseClient<Database> {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a client with dummy values — will fail at runtime when actually used
    // This prevents build-time crashes from missing env vars
    return createClient<Database>('https://placeholder.supabase.co', 'placeholder-key')
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

export const supabase: SupabaseClient<Database> = makeSupabase()
