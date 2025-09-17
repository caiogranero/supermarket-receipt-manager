'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

const Navigation = () => {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Scan Receipt', href: '/scan', icon: '📷' },
    { name: 'History', href: '/history', icon: '📋' },
    { name: 'Shopping List', href: '/shopping-list', icon: '📝' },
  ]

  const isActive = (path: string) => pathname === path

  if (status === 'loading') {
    return (
      <nav className="bg-blue-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="animate-pulse bg-white/20 h-8 w-32 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  if (!session) {
    return null
  }

  return (
    <nav className="bg-blue-600 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="flex-shrink-0 text-white font-bold text-lg sm:text-xl"
            >
              🛒 Receipt Manager
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => signOut()}
              className="text-blue-100 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-blue-100 hover:text-white hover:bg-blue-500 p-2 rounded-md"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-blue-500">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  signOut()
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-500 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation