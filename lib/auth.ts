import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { authApi } from "./api"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const response = await authApi.login(credentials.email, credentials.password)

          if (response.data.status && response.data.data) {
            const { user, accessToken } = response.data.data
            return {
              id: user._id,
              email: user.email,
              name: user.name,
              role: user.role,
              accessToken,
              image: user.profileImage,
            }
          }
          return null
        } catch (error) {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        ...(session.user || {}),
        role: token.role,
        accessToken: token.accessToken,
      } as any
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
}
