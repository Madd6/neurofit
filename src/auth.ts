import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { getPersonalData } from "./action/supabaseFunc";
import { redirect } from "next/navigation";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google,GitHub],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, account, profile}) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.id = profile?.sub || '',
        getPersonalData(token.id) === null? null:getPersonalData(token.id);
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.user.id = token.id || ''

      return session
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
  },
})