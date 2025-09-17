'use client'

import { useState } from 'react'

interface ManualUrlInputProps {
  onSubmit: (url: string) => void
  onCancel: () => void
}

const ManualUrlInput = ({ onSubmit, onCancel }: ManualUrlInputProps) => {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  // Validate NFCe URL format
  const validateNFCeURL = (url: string): boolean => {
    if (!url.trim()) return false

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      return false
    }

    // Check for NFCe-specific patterns
    const nfcePatterns = [
      /nfce/i,
      /\.fazenda\./i,
      /chNFe=/i,
      /nVersao=/i,
      /tpAmb=/i,
    ]

    return nfcePatterns.some(pattern => pattern.test(url)) && url.startsWith('http')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsValidating(true)

    const trimmedUrl = url.trim()

    if (!trimmedUrl) {
      setError('Please enter a URL')
      setIsValidating(false)
      return
    }

    if (!validateNFCeURL(trimmedUrl)) {
      setError('Please enter a valid NFCe URL. It should contain government domain (.fazenda.) and NFCe parameters.')
      setIsValidating(false)
      return
    }

    try {
      onSubmit(trimmedUrl)
    } catch (error) {
      setError('Failed to process URL. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setUrl(text)
        setError('')
      }
    } catch (error) {
      console.warn('Could not read clipboard:', error)
      setError('Could not access clipboard. Please paste manually.')
    }
  }

  const exampleUrls = [
    'https://www.sefaz.rs.gov.br/NFCE/NFCE-COM.aspx?chNFe=...',
    'https://nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/...',
    'https://www.nfce.fazenda.mg.gov.br/portalnfce/sistema/...'
  ]

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Manual URL Entry</h2>
            <p className="text-sm text-gray-600">Enter the NFCe URL from your receipt</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input */}
          <div>
            <label htmlFor="nfce-url" className="block text-sm font-medium text-gray-700 mb-2">
              NFCe URL
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                id="nfce-url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  setError('')
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="https://www.fazenda.gov.br/nfce/..."
                disabled={isValidating}
              />
              <button
                type="button"
                onClick={handlePaste}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                disabled={isValidating}
              >
                📋 Paste
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Examples */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Valid URL Examples:</h3>
            <div className="space-y-1">
              {exampleUrls.map((example, index) => (
                <p key={index} className="text-xs text-gray-600 font-mono break-all">
                  {example}
                </p>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Look for URLs containing .fazenda., NFCe, and parameters like chNFe=
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <h3 className="text-sm font-medium text-blue-900 mb-1">How to find the URL:</h3>
            <ol className="text-xs text-blue-700 space-y-1">
              <li>1. Look for a QR code on your receipt</li>
              <li>2. Use any QR code reader app to scan it</li>
              <li>3. Copy the URL that appears</li>
              <li>4. Paste it in the field above</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              disabled={isValidating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!url.trim() || isValidating}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isValidating ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </span>
              ) : (
                'Process Receipt'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ManualUrlInput