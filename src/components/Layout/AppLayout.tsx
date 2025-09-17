'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Navigation from './Navigation'
import Header from './Header'

interface AppLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  headerAction?: React.ReactNode
}

const AppLayout = ({ children, title, subtitle, headerAction }: AppLayoutProps) => {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Header title={title} subtitle={subtitle} action={headerAction} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  )
}

export default AppLayout