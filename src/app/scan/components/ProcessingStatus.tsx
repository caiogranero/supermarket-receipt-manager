'use client'

interface ProcessingStatusProps {
  isProcessing: boolean
  progress: number
  stage: 'validating' | 'scraping' | 'saving' | 'completed' | 'error' | null
  error: string | null
  onRetry?: () => void
  onClose?: () => void
}

const ProcessingStatus = ({
  isProcessing,
  progress,
  stage,
  error,
  onRetry,
  onClose
}: ProcessingStatusProps) => {
  if (!isProcessing && !error && stage !== 'completed') {
    return null
  }

  const stageMessages = {
    validating: 'Validating QR code...',
    scraping: 'Downloading receipt data...',
    saving: 'Saving to your account...',
    completed: 'Receipt processed successfully!',
    error: 'Processing failed'
  }

  const stageIcons = {
    validating: (
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
    ),
    scraping: (
      <div className="animate-pulse">
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      </div>
    ),
    saving: (
      <div className="animate-bounce">
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      </div>
    ),
    completed: (
      <div className="animate-pulse">
        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    error: (
      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 mx-4 max-w-sm w-full">
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            {stage && stageIcons[stage]}
          </div>

          {/* Title */}
          <h3 className={`text-lg font-semibold mb-2 ${
            stage === 'error' ? 'text-red-600' :
            stage === 'completed' ? 'text-green-600' :
            'text-gray-900'
          }`}>
            {stage && stageMessages[stage]}
          </h3>

          {/* Progress bar */}
          {isProcessing && stage !== 'error' && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success message */}
          {stage === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
              <p className="text-green-700 text-sm">
                Your receipt has been processed and saved. You&apos;ll be redirected to view the details.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex space-x-3 mt-6">
            {stage === 'error' && onRetry && (
              <button
                onClick={onRetry}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            )}

            {(stage === 'error' || stage === 'completed') && onClose && (
              <button
                onClick={onClose}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  stage === 'error'
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {stage === 'error' ? 'Close' : 'Continue'}
              </button>
            )}
          </div>

          {/* Progress percentage */}
          {isProcessing && stage !== 'error' && (
            <p className="text-xs text-gray-500 mt-2">{progress}% complete</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProcessingStatus