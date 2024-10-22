import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import pool from "./lib/db" // Adjust the import path if needed

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        const { name, email } = user
        try {
          // Check if the user already exists
          const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
          
          if (result.rows.length === 0) {
            // User doesn't exist, create a new user
            const [firstName, ...lastNameParts] = name.split(' ')
            const lastName = lastNameParts.join(' ')
            
            await pool.query(
              'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)',
              [firstName, lastName, email, 'google_auth'] // You might want to use a different placeholder for password
            )
          }
          return true
        } catch (error) {
          console.error("Error during Google sign in:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET,
})