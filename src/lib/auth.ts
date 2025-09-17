import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Validation schema for login credentials
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'user@example.com'
        },
        password: {
          label: 'Password',
          type: 'password'
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            return null
          }

          // Validate credentials format
          const validatedCredentials = loginSchema.parse(credentials)

          // Find user in database
          const user = await prisma.user.findUnique({
            where: {
              email: validatedCredentials.email,
            },
          })

          if (!user) {
            return null
          }

          // Verify password
          const isPasswordValid = await compare(
            validatedCredentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          // Return user object for session
          return {
            id: user.id,
            email: user.email,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}