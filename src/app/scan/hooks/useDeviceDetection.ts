'use client'

import { useState, useEffect } from 'react'

interface DeviceCapabilities {
  isMobile: boolean
  hasCamera: boolean
  supportsCameraScanning: boolean
  userAgent: string
}

export const useDeviceDetection = (): DeviceCapabilities => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    hasCamera: false,
    supportsCameraScanning: false,
    userAgent: ''
  })

  useEffect(() => {
    // Detect mobile device
    const userAgent = navigator.userAgent
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)

    // Check camera support
    const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)

    // Determine if camera scanning is supported
    const supportsCameraScanning = isMobile && hasCamera

    setCapabilities({
      isMobile,
      hasCamera,
      supportsCameraScanning,
      userAgent
    })
  }, [])

  return capabilities
}