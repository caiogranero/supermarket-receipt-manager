export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            SuperMarket Receipt Manager
          </h1>
          <p className="text-gray-600 mb-6">
            Personal inventory tracking system for São Paulo supermarket receipts via NFCe QR code scanning.
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-primary-50 rounded-lg">
              <h2 className="text-lg font-semibold text-primary-700 mb-2">
                🚀 System Status
              </h2>
              <p className="text-primary-600">
                Next.js API infrastructure ready for development
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-700">✅ Ready</h3>
                <ul className="text-sm text-green-600 mt-2 space-y-1">
                  <li>• Next.js 14+ App Router</li>
                  <li>• TypeScript configuration</li>
                  <li>• Tailwind CSS styling</li>
                  <li>• PWA configuration</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-700">🔧 Next Steps</h3>
                <ul className="text-sm text-blue-600 mt-2 space-y-1">
                  <li>• NFCe QR code integration</li>
                  <li>• Database setup</li>
                  <li>• Authentication system</li>
                  <li>• Receipt processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}