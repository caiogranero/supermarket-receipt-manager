'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Redirecting
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                SuperMarket Receipt Manager
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {session.user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🧾 Welcome to Your Receipt Manager
              </h2>
              <p className="text-gray-600 mb-8">
                Your secure dashboard for managing supermarket receipts and shopping data.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-3xl mb-4">📱</div>
                  <h3 className="text-lg font-semibold mb-2">Scan Receipts</h3>
                  <p className="text-gray-600 text-sm">
                    Upload and process your NFCe receipts from São Paulo supermarkets.
                  </p>
                  <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
                    Coming Soon
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-3xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                  <p className="text-gray-600 text-sm">
                    View your shopping patterns and expense analytics.
                  </p>
                  <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
                    Coming Soon
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-3xl mb-4">🛒</div>
                  <h3 className="text-lg font-semibold mb-2">Smart Lists</h3>
                  <p className="text-gray-600 text-sm">
                    Generate intelligent shopping lists based on your history.
                  </p>
                  <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
                    Coming Soon
                  </button>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Authentication Status</h4>
                <div className="text-sm text-blue-800">
                  <p>✅ You are successfully authenticated!</p>
                  <p>User ID: {session.user?.id}</p>
                  <p>Email: {session.user?.email}</p>
                  <p>Session expires: {new Date(session.expires).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}