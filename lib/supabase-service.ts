import { createClient } from '@supabase/supabase-js'

// Server-only client with the service role key. It bypasses row security, so
// it must never be imported into a 'use client' file. Use it for admin work
// (after requireAdmin) and for server code that needs private columns.
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
