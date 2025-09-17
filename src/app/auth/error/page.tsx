'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The sign in link is no longer valid. It may have been used already or it may have expired.',
  Default: 'An error occurred during authentication.',
  CredentialsSignin: 'Invalid email or password. Please check your credentials and try again.',
  EmailCreateAccount: 'Could not create user account with this email.',
  SessionRequired: 'Please sign in to access this page.',
  Callback: 'An error occurred during the authentication callback.',
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(errorMessages[errorParam] || errorMessages.Default)
    } else {
      setError(errorMessages.Default)
    }
  }, [searchParams])

  const handleRetry = () => {
    router.push('/auth/signin')
  }

  const handleHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-600">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            SuperMarket Receipt Manager
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Authentication Failed</h3>
                <div className="mt-2 text-sm">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleRetry}
              className="flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try Again
            </button>
            <button
              onClick={handleHome}
              className="flex-1 flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go Home
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <a
                href="/contact"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}