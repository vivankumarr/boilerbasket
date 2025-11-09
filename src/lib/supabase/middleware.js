import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// Middleware function to update the Supabase session and handle route access logic

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Create a Supabase client for the current request

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Attempt to retrieve the currently authenticated user from Supabase; if no valid session exists,
  // then "user" will be null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  // Redirect unauthenticated users trying to access admin routes to the login page

  if (isAdminRoute && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect already authenticated users away from the login page to the appointments page

  if (user && request.nextUrl.pathname === '/login') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/admin/appointments'
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}