'use client'

interface ScanningOverlayProps {
  isScanning: boolean
  isProcessing: boolean
  error: string | null
  scanCount: number
}

const ScanningOverlay = ({ isScanning, isProcessing, error, scanCount }: ScanningOverlayProps) => {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      {/* Scanning frame */}
      <div className="relative">
        {/* Main scanning frame */}
        <div className="w-64 h-64 border-2 border-transparent">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500"></div>

          {/* Scanning line animation */}
          {isScanning && !isProcessing && (
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
              <div
                className="w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                style={{
                  animation: 'scan-line 2s ease-in-out infinite',
                  transform: 'translateY(0)'
                }}
              ></div>
            </div>
          )}

          {/* Processing indicator */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-white text-sm font-medium">Processing...</p>
              </div>
            </div>
          )}
        </div>

        {/* Status messages */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
          {error ? (
            <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm max-w-xs">
              {error}
            </div>
          ) : isProcessing ? (
            <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm">
              Processing QR code...
            </div>
          ) : isScanning ? (
            <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full text-sm text-gray-800">
              Point camera at QR code
              {scanCount > 0 && (
                <span className="block text-xs text-gray-600 mt-1">
                  {scanCount} scan{scanCount !== 1 ? 's' : ''} attempted
                </span>
              )}
            </div>
          ) : (
            <div className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm">
              Camera starting...
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes scan-line {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(240px); opacity: 0.8; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default ScanningOverlay