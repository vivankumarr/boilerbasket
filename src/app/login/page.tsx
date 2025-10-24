'use client'

import React from 'react'
import { useFormStatus } from 'react-dom'
import { login, signup } from './actions'

function SubmitButton({
  children,
  formAction,
}: {
  children: React.ReactNode
  formAction: (fd: FormData) => Promise<any>
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      formAction={formAction}
      disabled={pending}
      className="w-full rounded-xl px-4 py-2 text-sm font-semibold tracking-wide shadow-sm
                 ring-1 ring-inset ring-purple-700/20 bg-purple-700 hover:bg-purple-600
                 active:bg-purple-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? 'Working…' : children}
    </button>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen grid place-items-center p-4 bg-gradient-to-br from-amber-100 via-purple-100 to-slate-100">
      <section className="w-full max-w-md rounded-3xl bg-white shadow-xl ring-2 ring-blue-400/90">
        <div className="px-8 pt-8 pb-4 text-center">
          <img src="/ace-boilerbasket-logo.png" alt="ACE BoilerBasket" className="mx-auto h-20 w-auto" />
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">BoilerBasket</h1>
          <p className="text-sm text-slate-600">Staff Login</p>
        </div>

        <div className="mx-6 h-px bg-slate-200" />

        <form className="px-8 py-6 space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
            <input
              id="email" name="email" type="email" required placeholder="Enter your email address"
              className="block w-full rounded-xl border-0 bg-slate-50 px-3 py-2 text-slate-900
                         shadow-inner ring-1 ring-inset ring-slate-200 placeholder:text-slate-400
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
            <input
              id="password" name="password" type="password" required placeholder="Enter your password"
              className="block w-full rounded-xl border-0 bg-slate-50 px-3 py-2 text-slate-900
                         shadow-inner ring-1 ring-inset ring-slate-200 placeholder:text-slate-400
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="pt-2 space-y-2">
            <SubmitButton formAction={login}>Sign In</SubmitButton>
            <SubmitButton formAction={signup}>Sign Up</SubmitButton>
          </div>
        </form>

        <div className="mx-6 h-px bg-slate-200" />
        <footer className="px-8 py-4 text-center text-sm text-slate-600">
          Need access? Contact your manager or shift leader.
        </footer>
      </section>
    </main>
  )
}