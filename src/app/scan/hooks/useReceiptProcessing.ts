'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface ProcessingState {
  isProcessing: boolean
  progress: number
  stage: 'validating' | 'scraping' | 'saving' | 'completed' | 'error' | null
  error: string | null
  receiptId: string | null
}

export const useReceiptProcessing = () => {
  const router = useRouter()
  const [state, setState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    stage: null,
    error: null,
    receiptId: null
  })

  const processNFCeURL = useCallback(async (url: string) => {
    setState({
      isProcessing: true,
      progress: 0,
      stage: 'validating',
      error: null,
      receiptId: null
    })

    try {
      // Stage 1: Validating URL
      setState(prev => ({ ...prev, progress: 20, stage: 'validating' }))

      const validateResponse = await fetch('/api/nfce/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      if (!validateResponse.ok) {
        throw new Error('Invalid NFCe URL format')
      }

      // Stage 2: Scraping receipt data
      setState(prev => ({ ...prev, progress: 50, stage: 'scraping' }))

      const scrapeResponse = await fetch('/api/nfce/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      if (!scrapeResponse.ok) {
        const errorData = await scrapeResponse.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to process receipt')
      }

      const scrapeData = await scrapeResponse.json()

      // Stage 3: Saving to database
      setState(prev => ({ ...prev, progress: 80, stage: 'saving' }))

      const saveResponse = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nfceUrl: url,
          receiptData: scrapeData
        })
      })

      if (!saveResponse.ok) {
        throw new Error('Failed to save receipt data')
      }

      const savedReceipt = await saveResponse.json()

      // Stage 4: Completed
      setState(prev => ({
        ...prev,
        progress: 100,
        stage: 'completed',
        receiptId: savedReceipt.id
      }))

      // Navigate to receipt details after a short delay
      setTimeout(() => {
        router.push(`/receipts/${savedReceipt.id}`)
      }, 2000)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setState(prev => ({
        ...prev,
        stage: 'error',
        error: errorMessage,
        isProcessing: false
      }))
    }
  }, [router])

  const reset = useCallback(() => {
    setState({
      isProcessing: false,
      progress: 0,
      stage: null,
      error: null,
      receiptId: null
    })
  }, [])

  const retry = useCallback((url: string) => {
    reset()
    setTimeout(() => processNFCeURL(url), 500)
  }, [reset, processNFCeURL])

  return {
    state,
    processNFCeURL,
    reset,
    retry
  }
}