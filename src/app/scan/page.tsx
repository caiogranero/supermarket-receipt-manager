'use client'

import AppLayout from '@/components/Layout/AppLayout'

const ScanPage = () => {
  return (
    <AppLayout
      title="Scan Receipt"
      subtitle="Scan NFCe QR codes to add receipts to your inventory"
    >
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="mb-6">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">📷</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Camera Scanner
            </h2>
            <p className="text-gray-600 text-sm">
              Use your mobile camera to scan NFCe QR codes directly
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <p className="text-blue-800 text-sm">
              📱 <strong>Mobile Only Feature</strong><br />
              Camera scanning is optimized for mobile devices. Desktop users can manually input URLs.
            </p>
          </div>

          <button
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            onClick={() => alert('Camera scanner will be implemented in Issue #15')}
          >
            Start Camera Scanner
          </button>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Alternative for desktop users:</p>
            <button
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              onClick={() => alert('Manual URL input will be available as fallback')}
            >
              Enter NFCe URL manually
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default ScanPage