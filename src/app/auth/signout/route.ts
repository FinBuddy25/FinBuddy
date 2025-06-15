import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  
  // Sign out on the server side
  await supabase.auth.signOut()
  
  return NextResponse.json({ success: true })
}
