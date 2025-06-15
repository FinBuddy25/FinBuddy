import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// This is a temporary solution to allow the build to complete
// In a production environment, you should use the proper server-side client
// with cookie handling as described in the Supabase documentation
export async function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
