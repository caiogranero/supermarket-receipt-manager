'use client'

import { useState, useCallback } from 'react'
import QrScanner from 'react-qr-scanner'
import { useReceiptProcessing } from '../hooks/useReceiptProcessing'
import ProcessingStatus from './ProcessingStatus'

interface QRCameraScannerProps {
  onClose: () => void
}

const QRCameraScanner = ({ onClose }: QRCameraScannerProps) => {
  const { state: processingState, processNFCeURL, reset: resetProcessing } = useReceiptProcessing()
  const [error, setError] = useState<string>('')

  const handleScan = useCallback((data: any) => {
    if (data && data.text) {
      console.log('QR Code scanned:', data.text)
      processNFCeURL(data.text)
    }
  }, [processNFCeURL])

  const handleError = useCallback((err: any) => {
    console.error('QR Scanner error:', err)
    setError('Failed to access camera or scan QR code. Please check permissions.')
  }, [])

  const handleClose = () => {
    resetProcessing()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header with close button */}
      <div className="flex justify-between items-center p-4 bg-black bg-opacity-50">
        <h2 className="text-white text-lg font-semibold">Scan QR Code</h2>
        <button
          onClick={handleClose}
          className="text-white hover:text-gray-300 text-2xl"
        >
          ✕
        </button>
      </div>

      {/* QR Scanner */}
      <div className="flex-1 relative">
        {!processingState.isProcessing ? (
          <QrScanner
            onScan={handleScan}
            onError={handleError}
            style={{ width: '100%', height: '100%' }}
            constraints={{
              video: { facingMode: 'environment' }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Processing QR code...</p>
            </div>
          </div>
        )}

        {/* Scanning overlay */}
        {!processingState.isProcessing && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border border-dashed border-white rounded"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute bottom-20 left-4 right-4 bg-red-500 text-white p-4 rounded-lg">
            <p>{error}</p>
            <button
              onClick={() => setError('')}
              className="mt-2 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Instructions */}
        {!processingState.isProcessing && (
          <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-center">
            <p>Point your camera at the NFCe QR code on your receipt</p>
          </div>
        )}
      </div>

      {/* Processing status modal */}
      <ProcessingStatus
        isProcessing={processingState.isProcessing}
        progress={processingState.progress}
        stage={processingState.stage}
        error={processingState.error}
        onRetry={() => resetProcessing()}
        onClose={handleClose}
      />
    </div>
  )
}

export default QRCameraScanner