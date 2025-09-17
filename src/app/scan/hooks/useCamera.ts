'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface CameraState {
  isInitializing: boolean
  isActive: boolean
  hasPermission: boolean
  error: string | null
  facingMode: 'user' | 'environment'
  torchEnabled: boolean
  availableCameras: MediaDeviceInfo[]
}

interface CameraControls {
  initializeCamera: () => Promise<void>
  stopCamera: () => void
  switchCamera: () => Promise<void>
  toggleTorch: () => Promise<void>
  requestPermissions: () => Promise<boolean>
}

export const useCamera = (externalVideoRef?: React.RefObject<HTMLVideoElement>): [CameraState, CameraControls] => {
  const internalVideoRef = useRef<HTMLVideoElement | null>(null)
  const videoRef = externalVideoRef || internalVideoRef
  const streamRef = useRef<MediaStream | null>(null)
  const [state, setState] = useState<CameraState>({
    isInitializing: false,
    isActive: false,
    hasPermission: false,
    error: null,
    facingMode: 'environment', // Start with back camera for QR scanning
    torchEnabled: false,
    availableCameras: []
  })

  // Get available cameras
  const getAvailableCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const cameras = devices.filter(device => device.kind === 'videoinput')
      setState(prev => ({ ...prev, availableCameras: cameras }))
      return cameras
    } catch (error) {
      console.error('Error getting cameras:', error)
      return []
    }
  }, [])

  // Request camera permissions
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      // Request permission by trying to access the camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: state.facingMode }
      })

      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop())

      setState(prev => ({ ...prev, hasPermission: true, error: null }))
      await getAvailableCameras()
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Camera access denied'
      setState(prev => ({
        ...prev,
        hasPermission: false,
        error: errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')
          ? 'Camera access denied. Please allow camera permissions and try again.'
          : `Camera error: ${errorMessage}`
      }))
      return false
    }
  }, [state.facingMode, getAvailableCameras])

  // Initialize camera with video element
  const initializeCamera = useCallback(async () => {
    if (!videoRef.current) {
      setState(prev => ({ ...prev, error: 'Video element not ready' }))
      return
    }

    setState(prev => ({ ...prev, isInitializing: true, error: null }))

    try {
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: state.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      videoRef.current.srcObject = stream

      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => resolve()
        }
      })

      await videoRef.current.play()

      setState(prev => ({
        ...prev,
        isInitializing: false,
        isActive: true,
        hasPermission: true,
        error: null
      }))

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to access camera'
      setState(prev => ({
        ...prev,
        isInitializing: false,
        isActive: false,
        error: errorMessage.includes('NotAllowedError')
          ? 'Camera access denied. Please allow camera permissions and try again.'
          : errorMessage.includes('NotFoundError')
          ? 'No camera found. Please ensure your device has a camera.'
          : `Camera error: ${errorMessage}`
      }))
    }
  }, [state.facingMode, videoRef])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setState(prev => ({
      ...prev,
      isActive: false,
      torchEnabled: false,
      error: null
    }))
  }, [videoRef])

  // Switch between front and back camera
  const switchCamera = useCallback(async () => {
    const newFacingMode = state.facingMode === 'user' ? 'environment' : 'user'
    setState(prev => ({ ...prev, facingMode: newFacingMode }))

    if (state.isActive) {
      await initializeCamera()
    }
  }, [state.facingMode, state.isActive, initializeCamera])

  // Toggle camera flash/torch
  const toggleTorch = useCallback(async () => {
    if (!streamRef.current) return

    try {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      const capabilities = videoTrack.getCapabilities() as any

      if (capabilities.torch) {
        const newTorchEnabled = !state.torchEnabled
        await videoTrack.applyConstraints({
          advanced: [{ torch: newTorchEnabled }] as any
        })
        setState(prev => ({ ...prev, torchEnabled: newTorchEnabled }))
      } else {
        setState(prev => ({ ...prev, error: 'Flash not supported on this device' }))
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to toggle flash: ' + (error instanceof Error ? error.message : 'Unknown error')
      }))
    }
  }, [state.torchEnabled])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  const controls: CameraControls = {
    initializeCamera,
    stopCamera,
    switchCamera,
    toggleTorch,
    requestPermissions
  }

  return [state, controls]
}