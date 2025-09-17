'use client'

import AppLayout from '@/components/Layout/AppLayout'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <AppLayout
      title="Dashboard"
      subtitle="Overview of your receipt scanning and inventory management"
      headerAction={
        <Link
          href="/scan"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Scan Receipt
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">🧾</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Receipts</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">No receipts scanned yet</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">R$ 0.00</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">This month</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Shopping Lists</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Active lists</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/scan"
              className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">📷</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Scan Receipt</p>
                <p className="text-sm text-gray-600">Use camera to scan</p>
              </div>
            </Link>

            <Link
              href="/history"
              className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">📋</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">View History</p>
                <p className="text-sm text-gray-600">Browse receipts</p>
              </div>
            </Link>

            <Link
              href="/shopping-list"
              className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
            >
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">🛒</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Shopping List</p>
                <p className="text-sm text-gray-600">AI suggestions</p>
              </div>
            </Link>

            <div className="flex items-center p-4 bg-yellow-50 rounded-lg opacity-75">
              <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">📊</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Analytics</p>
                <p className="text-sm text-gray-600">Coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-3xl">🚀</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Get Started</h3>
              <p className="text-gray-700 mb-4">
                Welcome to your SuperMarket Receipt Manager! Start by scanning your first NFCe receipt
                to build your personal inventory tracking system.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/scan"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span className="mr-2">📷</span>
                  Scan Your First Receipt
                </Link>
                <a
                  href="#"
                  className="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Documentation will be available soon!')
                  }}
                >
                  <span className="mr-2">📖</span>
                  View Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}