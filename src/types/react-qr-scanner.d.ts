declare module 'react-qr-scanner' {
  import { Component } from 'react'

  interface QrScannerProps {
    onScan?: (data: { text: string } | null) => void
    onError?: (error: any) => void
    style?: React.CSSProperties
    constraints?: MediaStreamConstraints
    delay?: number
    facingMode?: 'user' | 'environment'
    legacyMode?: boolean
    resolution?: number
    showViewFinder?: boolean
    className?: string
  }

  export default class QrScanner extends Component<QrScannerProps> {}
}