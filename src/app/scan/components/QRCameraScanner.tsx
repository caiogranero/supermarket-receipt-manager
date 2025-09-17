'use client'

import { useEffect, useRef, useState } from 'react'
import { useCamera } from '../hooks/useCamera'
import { useQRScanner } from '../hooks/useQRScanner'
import { useReceiptProcessing } from '../hooks/useReceiptProcessing'
import ScanningOverlay from './ScanningOverlay'
import CameraControls from './CameraControls'
import ProcessingStatus from './ProcessingStatus'

interface QRCameraScannerProps {
  onClose: () => void
}

const QRCameraScanner = ({ onClose }: QRCameraScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraState, cameraControls] = useCamera(videoRef)
  const [lastScannedUrl, setLastScannedUrl] = useState<string>('')

  const { state: processingState, processNFCeURL, reset: resetProcessing, retry } = useReceiptProcessing()

  const handleScanSuccess = (url: string) => {
    console.log('QR Code scanned:', url)
    setLastScannedUrl(url)
    qrControls.stopScanning()
    processNFCeURL(url)
  }

  const handleScanError = (error: string) => {
    console.warn('QR scan error:', error)
  }

  const [qrState, qrControls] = useQRScanner(handleScanSuccess, handleScanError)

  // Initialize camera on mount
  useEffect(() => {
    const initCamera = async () => {
      const hasPermission = await cameraControls.requestPermissions()
      if (hasPermission && videoRef.current) {
        await cameraControls.initializeCamera()
      }
    }

    initCamera()

    return () => {
      cameraControls.stopCamera()
      qrControls.stopScanning()
    }
  }, [cameraControls, qrControls])

  // Start QR scanning when camera becomes active
  useEffect(() => {
    if (cameraState.isActive && videoRef.current && !qrState.isScanning && !processingState.isProcessing) {
      qrControls.startScanning(videoRef.current)
    }
  }, [cameraState.isActive, qrState.isScanning, processingState.isProcessing, qrControls])

  const handleClose = () => {
    qrControls.stopScanning()
    cameraControls.stopCamera()
    onClose()
  }

  const handleRetryProcessing = () => {
    resetProcessing()
    if (lastScannedUrl) {
      retry(lastScannedUrl)
    } else {
      // Resume scanning if no last URL
      if (videoRef.current && cameraState.isActive) {
        qrControls.startScanning(videoRef.current)
      }
    }
  }

  const handleProcessingClose = () => {
    resetProcessing()
    handleClose()
  }


  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Camera view */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Scanning overlay */}
        <ScanningOverlay
          isScanning={qrState.isScanning}
          isProcessing={qrState.isProcessing || processingState.isProcessing}
          error={qrState.error || cameraState.error}
          scanCount={qrState.scanCount}
        />

        {/* Camera controls */}
        {cameraState.isActive && !processingState.isProcessing && (
          <CameraControls
            onSwitchCamera={cameraControls.switchCamera}
            onToggleFlash={cameraControls.toggleTorch}
            onClose={handleClose}
            facingMode={cameraState.facingMode}
            torchEnabled={cameraState.torchEnabled}
            availableCameras={cameraState.availableCameras}
            disabled={cameraState.isInitializing || qrState.isProcessing}
          />
        )}

        {/* Permission error overlay */}
        {!cameraState.hasPermission && cameraState.error && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 mx-4 max-w-sm text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Access Required</h3>
              <p className="text-gray-600 text-sm mb-6">{cameraState.error}</p>
              <div className="space-y-3">
                <button
                  onClick={cameraControls.requestPermissions}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Grant Camera Access
                </button>
                <button
                  onClick={handleClose}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {cameraState.isInitializing && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg">Starting camera...</p>
              <p className="text-sm text-gray-300 mt-2">Please wait a moment</p>
            </div>
          </div>
        )}
      </div>

      {/* Processing status modal */}
      <ProcessingStatus
        isProcessing={processingState.isProcessing}
        progress={processingState.progress}
        stage={processingState.stage}
        error={processingState.error}
        onRetry={handleRetryProcessing}
        onClose={handleProcessingClose}
      />
    </div>
  )
}

export default QRCameraScanner