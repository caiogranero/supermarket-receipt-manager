'use client'

import { useState } from 'react'
import ManualUrlInput from './ManualUrlInput'

interface DesktopFallbackProps {
  hasCamera: boolean
  onUrlSubmit: (url: string) => void
}

const DesktopFallback = ({ hasCamera, onUrlSubmit }: DesktopFallbackProps) => {
  const [showManualInput, setShowManualInput] = useState(false)

  if (showManualInput) {
    return (
      <ManualUrlInput
        onSubmit={onUrlSubmit}
        onCancel={() => setShowManualInput(false)}
      />
    )
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Icon */}
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📱 Mobile Feature Only
        </h2>

        {/* Description */}
        <div className="text-gray-600 mb-6 space-y-3">
          <p className="text-sm">
            Camera QR code scanning is optimized for mobile devices with rear-facing cameras.
          </p>

          {!hasCamera ? (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <p className="text-amber-700 text-sm">
                <strong>No camera detected</strong><br />
                Your device doesn&apos;t appear to have camera support.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-blue-700 text-sm">
                <strong>Camera available</strong><br />
                For the best experience, please use this feature on your mobile phone.
              </p>
            </div>
          )}
        </div>

        {/* Alternative options */}
        <div className="space-y-4">
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Alternative Options:</h3>

            <div className="space-y-3">
              {/* Manual URL input */}
              <button
                onClick={() => setShowManualInput(true)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                📝 Enter NFCe URL Manually
              </button>

              {/* Mobile instructions */}
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  📲 Use on Mobile:
                </h4>
                <ol className="text-xs text-gray-600 space-y-1">
                  <li>1. Open this website on your mobile phone</li>
                  <li>2. Navigate to the Scan page</li>
                  <li>3. Allow camera permissions when prompted</li>
                  <li>4. Point camera at the QR code on your receipt</li>
                </ol>
              </div>

              {/* QR code help */}
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  🔍 About NFCe QR Codes:
                </h4>
                <p className="text-xs text-gray-600">
                  NFCe (Nota Fiscal de Consumidor Eletrônica) QR codes are found on electronic receipts
                  from Brazilian retailers. They contain a URL that links to the official receipt data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 text-xs text-gray-500">
          <p>
            💡 <strong>Tip:</strong> For faster scanning, bookmark this page on your mobile device
          </p>
        </div>
      </div>
    </div>
  )
}

export default DesktopFallback