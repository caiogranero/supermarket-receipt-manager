// Application Types
export interface User {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthError {
  error: string
  message: string
  details?: Array<{
    field: string
    message: string
  }>
}

export interface AuthResponse {
  message: string
  user?: {
    id: string
    email: string
    createdAt: Date
  }
  error?: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form Types
export interface RegisterFormData {
  email: string
  password: string
}

export interface LoginFormData {
  email: string
  password: string
}