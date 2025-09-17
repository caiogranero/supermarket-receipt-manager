'use client'

interface CameraControlsProps {
  onSwitchCamera: () => void
  onToggleFlash: () => void
  onClose: () => void
  facingMode: 'user' | 'environment'
  torchEnabled: boolean
  availableCameras: MediaDeviceInfo[]
  disabled?: boolean
}

const CameraControls = ({
  onSwitchCamera,
  onToggleFlash,
  onClose,
  facingMode,
  torchEnabled,
  availableCameras,
  disabled = false
}: CameraControlsProps) => {
  const hasFrontCamera = availableCameras.some(camera =>
    camera.label.toLowerCase().includes('front') || camera.label.toLowerCase().includes('user')
  )
  const hasBackCamera = availableCameras.some(camera =>
    camera.label.toLowerCase().includes('back') || camera.label.toLowerCase().includes('environment')
  )
  const canSwitchCameras = hasFrontCamera && hasBackCamera

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
      <div className="flex items-center space-x-4 bg-black bg-opacity-50 rounded-full px-6 py-3">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={disabled}
          className="w-12 h-12 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:opacity-50 rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Close camera"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Flash toggle */}
        <button
          onClick={onToggleFlash}
          disabled={disabled}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${
            torchEnabled
              ? 'bg-yellow-500 hover:bg-yellow-400'
              : 'bg-gray-600 hover:bg-gray-500'
          } disabled:bg-gray-700 disabled:opacity-50`}
          aria-label={torchEnabled ? 'Turn off flash' : 'Turn on flash'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {torchEnabled ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            )}
          </svg>
        </button>

        {/* Camera switch */}
        {canSwitchCameras && (
          <button
            onClick={onSwitchCamera}
            disabled={disabled}
            className="w-12 h-12 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:opacity-50 rounded-full flex items-center justify-center text-white transition-colors"
            aria-label={`Switch to ${facingMode === 'user' ? 'back' : 'front'} camera`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      {/* Camera info */}
      <div className="text-center mt-2">
        <p className="text-xs text-white bg-black bg-opacity-50 rounded px-2 py-1">
          {facingMode === 'user' ? 'Front' : 'Back'} Camera
          {availableCameras.length > 0 && (
            <span className="ml-2">• {availableCameras.length} available</span>
          )}
        </p>
      </div>
    </div>
  )
}

export default CameraControls