import { createClient } from '@supabase/supabase-js'

// This client uses the SERVICE_ROLE_KEY to bypass RLS. Only use on server!

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabaseService = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      // Ensure the service role is used
      autoRefreshToken: false,
      persistSession: false
    }
  }
)