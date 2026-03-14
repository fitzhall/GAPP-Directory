'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [adminUser, setAdminUser] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth')
    const user = sessionStorage.getItem('admin_user')
    if (auth === 'true') {
      setIsAuthenticated(true)
      setAdminUser(user || 'admin')
    }
    setIsLoading(false)
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username || undefined, password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        sessionStorage.setItem('admin_auth', 'true')
        sessionStorage.setItem('admin_user', data.username || 'admin')
        setIsAuthenticated(true)
        setAdminUser(data.username || 'admin')
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('Failed to authenticate')
    }

    setSubmitting(false)
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_auth')
    sessionStorage.removeItem('admin_user')
    setIsAuthenticated(false)
    setAdminUser('')
    setUsername('')
    setPassword('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-sm text-gray-600 mt-1">Sign in to manage the directory</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                autoFocus
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!password || submitting}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                password && !submitting
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            Contact the site owner if you need access
          </p>
        </div>
      </div>
    )
  }

  const navLinks = [
    { href: '/admin', label: 'Providers' },
    { href: '/admin/leads', label: 'Leads' },
    { href: '/admin/requests', label: 'Requests' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/admin/guide', label: 'Guide' },
  ]

  return (
    <div className="relative">
      {/* Admin top bar */}
      <div className="sticky top-0 z-50 bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-sm">Admin Panel</span>
          <nav className="flex gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  pathname === link.href
                    ? 'text-white font-medium'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">
            Logged in as <span className="text-white font-medium">{adminUser}</span>
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-gray-700 text-white text-xs font-medium rounded hover:bg-gray-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}
