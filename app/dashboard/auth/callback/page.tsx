'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Supabase sends the sign-in link here with the session in the #fragment
// (implicit flow), so it works even when the link is opened on a different
// device than the one that asked for it. Hand the tokens to the server, which
// sets the session cookies and links the listing.
export default function AuthCallbackPage() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1))
    // Drop the tokens from the address bar and history.
    window.history.replaceState(null, '', window.location.pathname)

    const linkError = params.get('error_code') || params.get('error')
    if (linkError) {
      setMessage(
        linkError === 'otp_expired'
          ? 'That sign-in link has expired or was already used. Send yourself a new one.'
          : 'That sign-in link did not work. Send yourself a new one.'
      )
      return
    }

    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')
    if (!access_token || !refresh_token) {
      setMessage('That sign-in link did not work. Send yourself a new one.')
      return
    }

    fetch('/dashboard/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token, refresh_token }),
    })
      .then(async (res) => {
        if (res.ok) {
          window.location.replace('/dashboard')
          return
        }
        const data = await res.json().catch(() => ({}))
        setMessage(
          data.error === 'no_listing'
            ? 'We could not find a listing claimed with this email. Use the email you claimed your listing with, or email help@georgiagapp.com.'
            : 'We could not sign you in. Send yourself a new link.'
        )
      })
      .catch(() => setMessage('We could not sign you in. Send yourself a new link.'))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm text-center">
        {message ? (
          <>
            <p className="text-gray-700 mb-6">{message}</p>
            <Link
              href="/dashboard/login"
              className="inline-block w-full py-3 rounded-lg font-medium bg-primary text-white hover:bg-primary/90"
            >
              Send a New Link
            </Link>
          </>
        ) : (
          <p className="text-gray-600">Signing you in...</p>
        )}
      </div>
    </div>
  )
}
