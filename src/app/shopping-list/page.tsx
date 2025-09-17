'use client'

import AppLayout from '@/components/Layout/AppLayout'

const ShoppingListPage = () => {
  return (
    <AppLayout
      title="Smart Shopping List"
      subtitle="AI-generated shopping suggestions based on your purchase history"
      headerAction={
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
          Generate New
        </button>
      }
    >
      <div className="space-y-6">
        {/* Current shopping list */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">This Week&apos;s Suggestions</h2>
              <span className="text-sm text-gray-500">Updated 3 hours ago</span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Milk', category: 'Dairy', confidence: 'High', last: '5 days ago' },
                { name: 'Bananas', category: 'Fruits', confidence: 'High', last: '3 days ago' },
                { name: 'Bread', category: 'Bakery', confidence: 'Medium', last: '1 week ago' },
                { name: 'Tomatoes', category: 'Vegetables', confidence: 'Medium', last: '4 days ago' },
                { name: 'Chicken', category: 'Meat', confidence: 'Low', last: '2 weeks ago' },
                { name: 'Rice', category: 'Pantry', confidence: 'High', last: '1 week ago' },
              ].map((item) => (
                <div
                  key={item.name}
                  className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.confidence === 'High'
                          ? 'bg-green-100 text-green-800'
                          : item.confidence === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.confidence}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    {item.category} • Last bought {item.last}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button className="flex-1 bg-green-50 text-green-700 py-2 px-3 rounded text-sm font-medium hover:bg-green-100 transition-colors">
                      Add to List
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shopping list creation info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">🤖</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-blue-900">AI-Powered Recommendations</h3>
              <p className="mt-1 text-sm text-blue-700">
                Shopping suggestions are generated based on your purchase history, consumption patterns,
                and seasonal trends. The more receipts you scan, the smarter the recommendations become.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default ShoppingListPage