'use client'

import { useState, useEffect } from 'react'
import AppLayout from '@/components/Layout/AppLayout'
import { useDeviceDetection } from './hooks/useDeviceDetection'
import { useReceiptProcessing } from './hooks/useReceiptProcessing'
import QRCameraScanner from './components/QRCameraScanner'
import DesktopFallback from './components/DesktopFallback'
import ProcessingStatus from './components/ProcessingStatus'

const ScanPage = () => {
  const { isMobile, hasCamera, supportsCameraScanning } = useDeviceDetection()
  const { state: processingState, processNFCeURL, reset: resetProcessing, retry } = useReceiptProcessing()
  const [showScanner, setShowScanner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Wait for device detection to complete
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleStartScanner = () => {
    if (supportsCameraScanning) {
      setShowScanner(true)
    }
  }

  const handleCloseScanner = () => {
    setShowScanner(false)
    resetProcessing()
  }

  const handleManualUrlSubmit = (url: string) => {
    processNFCeURL(url)
  }

  const handleRetryProcessing = () => {
    resetProcessing()
  }

  const handleProcessingClose = () => {
    resetProcessing()
  }

  // Show loading state while detecting device capabilities
  if (isLoading) {
    return (
      <AppLayout
        title="Scan Receipt"
        subtitle="Loading scanner..."
      >
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Detecting device capabilities...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Show camera scanner for mobile devices
  if (showScanner && supportsCameraScanning) {
    return <QRCameraScanner onClose={handleCloseScanner} />
  }

  // Main scan page with device-appropriate interface
  return (
    <AppLayout
      title="Scan Receipt"
      subtitle={supportsCameraScanning
        ? "Use your camera to scan NFCe QR codes"
        : "Enter NFCe URLs to process receipts"
      }
    >
      {supportsCameraScanning ? (
        // Mobile interface with camera scanner
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mb-6">
              <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">📷</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                QR Code Scanner
              </h2>
              <p className="text-gray-600 text-sm">
                Point your camera at the NFCe QR code on your receipt
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <p className="text-green-800 text-sm">
                ✅ <strong>Camera Ready</strong><br />
                Your device supports camera scanning for faster receipt processing.
              </p>
            </div>

            <button
              onClick={handleStartScanner}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              📷 Start Camera Scanner
            </button>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Having trouble with the camera?</p>
              <DesktopFallback
                hasCamera={hasCamera}
                onUrlSubmit={handleManualUrlSubmit}
              />
            </div>
          </div>

          {/* Device info for debugging */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 bg-gray-100 rounded p-3 text-xs">
              <p><strong>Debug Info:</strong></p>
              <p>Mobile: {isMobile ? 'Yes' : 'No'}</p>
              <p>Camera: {hasCamera ? 'Available' : 'Not found'}</p>
              <p>Scanner Support: {supportsCameraScanning ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
      ) : (
        // Desktop/non-camera interface
        <DesktopFallback
          hasCamera={hasCamera}
          onUrlSubmit={handleManualUrlSubmit}
        />
      )}

      {/* Processing status modal for manual URL input */}
      <ProcessingStatus
        isProcessing={processingState.isProcessing}
        progress={processingState.progress}
        stage={processingState.stage}
        error={processingState.error}
        onRetry={handleRetryProcessing}
        onClose={handleProcessingClose}
      />
    </AppLayout>
  )
}

export default ScanPage