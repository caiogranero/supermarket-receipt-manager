'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { BrowserQRCodeReader, Result } from '@zxing/library'

interface QRScannerState {
  isScanning: boolean
  isProcessing: boolean
  lastResult: string | null
  error: string | null
  scanCount: number
}

interface QRScannerControls {
  startScanning: (videoElement: HTMLVideoElement) => Promise<void>
  stopScanning: () => void
  reset: () => void
}

export const useQRScanner = (
  onScanSuccess: (result: string) => void,
  onScanError?: (error: string) => void
): [QRScannerState, QRScannerControls] => {
  const [state, setState] = useState<QRScannerState>({
    isScanning: false,
    isProcessing: false,
    lastResult: null,
    error: null,
    scanCount: 0
  })

  const readerRef = useRef<BrowserQRCodeReader | null>(null)
  const controlsRef = useRef<{ stop: () => void } | null>(null)
  const lastScanRef = useRef<number>(0)

  // Initialize QR reader
  useEffect(() => {
    readerRef.current = new BrowserQRCodeReader()
    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop()
      }
    }
  }, [])

  // Validate NFCe URL format
  const isValidNFCeURL = useCallback((url: string): boolean => {
    // Brazilian NFCe URLs typically contain:
    // - .fazenda. or similar government domain
    // - NFCe or nfce in the URL
    // - Specific parameters like chNFe, nVersao, tpAmb
    const nfcePatterns = [
      /nfce/i,
      /\.fazenda\./i,
      /chNFe=/i,
      /nVersao=/i,
      /tpAmb=/i,
    ]

    return nfcePatterns.some(pattern => pattern.test(url)) && url.startsWith('http')
  }, [])

  // Process scan result
  const processScanResult = useCallback((result: Result) => {
    const now = Date.now()
    const text = result.getText()

    // Prevent duplicate scans within 2 seconds
    if (now - lastScanRef.current < 2000 && state.lastResult === text) {
      return
    }

    lastScanRef.current = now

    setState(prev => ({
      ...prev,
      lastResult: text,
      scanCount: prev.scanCount + 1,
      isProcessing: true,
      error: null
    }))

    // Validate if it's a valid NFCe URL
    if (isValidNFCeURL(text)) {
      setState(prev => ({ ...prev, isProcessing: false }))
      onScanSuccess(text)
    } else {
      const errorMsg = 'This does not appear to be a valid NFCe QR code. Please scan a receipt QR code.'
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: errorMsg
      }))
      onScanError?.(errorMsg)

      // Clear error after 3 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, error: null }))
      }, 3000)
    }
  }, [state.lastResult, isValidNFCeURL, onScanSuccess, onScanError])

  // Start scanning
  const startScanning = useCallback(async (videoElement: HTMLVideoElement) => {
    if (!readerRef.current || state.isScanning) return

    try {
      setState(prev => ({ ...prev, isScanning: true, error: null }))

      // Start continuous scanning with interval-based approach
      const scanInterval = setInterval(async () => {
        if (!readerRef.current || !videoElement) {
          clearInterval(scanInterval)
          return
        }

        try {
          const result = await readerRef.current.decodeFromVideoElement(videoElement)
          if (result) {
            processScanResult(result)
            // Don't stop scanning - continue for potential new QR codes
          }
        } catch (error) {
          // Ignore scanning errors - they're expected when no QR code is visible
          console.debug('QR scan attempt (no code found)')
        }
      }, 100) // Scan every 100ms

      // Store cleanup function
      controlsRef.current = {
        stop: () => {
          clearInterval(scanInterval)
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start QR scanning'
      setState(prev => ({
        ...prev,
        isScanning: false,
        error: errorMessage
      }))
      onScanError?.(errorMessage)
    }
  }, [state.isScanning, processScanResult, onScanError])

  // Stop scanning
  const stopScanning = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.stop()
      controlsRef.current = null
    }

    setState(prev => ({
      ...prev,
      isScanning: false,
      isProcessing: false
    }))
  }, [])

  // Reset scanner state
  const reset = useCallback(() => {
    stopScanning()
    setState({
      isScanning: false,
      isProcessing: false,
      lastResult: null,
      error: null,
      scanCount: 0
    })
    lastScanRef.current = 0
  }, [stopScanning])

  const controls: QRScannerControls = {
    startScanning,
    stopScanning,
    reset
  }

  return [state, controls]
}