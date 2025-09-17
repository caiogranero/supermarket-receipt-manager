'use client'

import { useSession } from 'next-auth/react'

interface HeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

const Header = ({ title, subtitle, action }: HeaderProps) => {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 sm:py-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500 truncate">
                {subtitle}
              </p>
            )}
            {session?.user && (
              <p className="mt-1 text-xs text-gray-400">
                Welcome back, {session.user.email}
              </p>
            )}
          </div>
          {action && (
            <div className="flex-shrink-0 ml-4">
              {action}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header