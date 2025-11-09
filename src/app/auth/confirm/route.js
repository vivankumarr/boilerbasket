'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') || null
  const next = searchParams.get('next') ?? '/admin/appointments'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {

      // Redirect user to specified redirect URL or /admin/appointments
      redirect(next)
    }
  }

  // Redirect the user to an error page with a button to return to /booking
  redirect('/error')
}