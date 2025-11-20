'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ErrorPage() {
  return (
    <main className="min-h-screen grid place-items-center p-4 bg-gradient-to-br from-amber-100 via-purple-100 to-slate-100">
      <section className="w-full max-w-sm rounded-3xl bg-white shadow-xl flex flex-col items-center justify-center text-center p-8 space-y-6">
        <Image
          src="/boilerbasket-logo.png"
          alt="BoilerBasket Logo"
          width={100}
          height={100}
          className="mx-auto"
        />
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
          Something went wrong.
        </h1>
        <Link href="/book" className="w-full">
          <button
            className="w-full rounded-[6px] px-4 py-2 text-sm font-semibold tracking-wide shadow-sm
                      ring-1 ring-inset ring-purple-700/20 bg-purple-700 hover:bg-purple-600
                      active:bg-purple-700 text-white"
          >
            Go to the Home Page
          </button>
        </Link>
      </section>
    </main>
  )
}
