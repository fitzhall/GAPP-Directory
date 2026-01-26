'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const tools = [
    { href: '/screener', label: 'Check Eligibility', icon: 'check' },
    { href: '/quiz', label: 'Help Me Choose', icon: 'question' },
  ]

  const links = [
    { href: '/directory', label: 'Find Provider' },
    { href: '/georgia-pediatric-program', label: 'What is GAPP?' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/waivers', label: 'Medicaid Waivers' },
    { href: '/providers', label: 'For Providers' },
  ]

  return (
    <div className="md:hidden flex items-center">
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
            {/* Family Tools Section */}
            <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-accent/5 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Family Tools</p>
              <div className="flex gap-2">
                {tools.map(tool => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      pathname === tool.href
                        ? 'bg-primary text-white'
                        : 'bg-white text-primary border border-primary/30 hover:bg-primary/5'
                    }`}
                  >
                    {tool.icon === 'check' ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {tool.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="px-4 py-3 space-y-1">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
