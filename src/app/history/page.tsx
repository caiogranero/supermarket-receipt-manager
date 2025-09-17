'use client'

import AppLayout from '@/components/Layout/AppLayout'

const HistoryPage = () => {
  return (
    <AppLayout
      title="Purchase History"
      subtitle="View and search through your scanned receipts"
      headerAction={
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Filter
        </button>
      }
    >
      <div className="space-y-6">
        {/* Search bar */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search receipts, products, or stores..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Recent receipts */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Receipts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">🧾</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Supermarket Receipt #{item}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Scanned 2 days ago • R$ 45.90
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Processed
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Receipt history will be populated from the database once NFCe processing is implemented.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default HistoryPage