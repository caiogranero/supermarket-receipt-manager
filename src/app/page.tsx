'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, status } = useSession()

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            🧾 SuperMarket Receipt Manager
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Personal inventory tracking system for São Paulo supermarket receipts via NFCe QR code scanning
          </p>

          {session ? (
            <div className="space-y-4">
              <p className="text-lg text-green-600 font-semibold">
                Welcome back, {session.user?.email}!
              </p>
              <div className="space-x-4">
                <Link
                  href="/dashboard"
                  className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-gray-600 mb-8">
                Secure, private receipt management for smart shopping insights
              </p>
              <div className="space-x-4">
                <Link
                  href="/auth/signin"
                  className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold border border-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-lg font-semibold mb-2">NFCe Integration</h3>
              <p className="text-gray-600 text-sm">
                Scan QR codes from São Paulo supermarket receipts for automatic data extraction
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2">Smart Analytics</h3>
              <p className="text-gray-600 text-sm">
                Track spending patterns and get insights into your shopping habits
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">
                Your receipt data stays private with secure authentication and encrypted storage
              </p>
            </div>
          </div>

          {session && (
            <div className="mt-8 p-4 bg-green-50 rounded-lg max-w-md mx-auto">
              <h4 className="font-semibold text-green-900 mb-2">🔐 Authentication Status</h4>
              <div className="text-sm text-green-800">
                <p>✅ Successfully authenticated</p>
                <p>Session expires: {new Date(session.expires).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          <div className="mt-16 p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">✅ System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-left">
                <h4 className="font-semibold text-green-700 mb-2">Implemented</h4>
                <ul className="text-sm text-green-600 space-y-1">
                  <li>• NextAuth.js Authentication ✅</li>
                  <li>• User Registration/Login ✅</li>
                  <li>• PostgreSQL Database ✅</li>
                  <li>• Protected Routes ✅</li>
                  <li>• Session Management ✅</li>
                </ul>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-blue-700 mb-2">Next Steps</h4>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• NFCe QR code parsing</li>
                  <li>• Receipt data extraction</li>
                  <li>• Shopping analytics</li>
                  <li>• Smart shopping lists</li>
                  <li>• Mobile PWA features</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}