import NextAuth, { DefaultSession } from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { createClient } from "./utils/supabase/server"
// import { redirect } from "next/navigation"

// ✅ Minimal DB function - hanya sinkronisasi user ID
async function syncUserToDb(userData: {
  id: string
  email: string
  name: string
  image: string
  provider: string
}) {
  try {
    // ✅ Simple upsert - hanya basic info
    const supabase = await createClient()
    const response = await supabase
    .from("personalInfo")
    .upsert({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        image: userData.image,
        provider: userData.provider,
      }, {
      onConflict: "userId",
      ignoreDuplicates: false,
    })
    .select()
    // const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users`, {
    //   method: 'POST',
    //   headers: {
    //     'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
    //     'Content-Type': 'application/json',
    //     'Prefer': 'resolution=merge-duplicates'
    //   },
    //   body: JSON.stringify({
    //     id: userData.id,
    //     email: userData.email,
    //     name: userData.name,
    //     image: userData.image,
    //     provider: userData.provider,
    //   })
    // })
    return response
  } catch (error) {
    console.error('Sync error:', error)
    return false
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string | null
      location: string | null
      provider: string
    } & DefaultSession["user"]
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      // ✅ Sync minimal data ke DB (fire and forget)
      if (account && profile) {
        syncUserToDb({
          id: user.id || profile.sub || '',
          email: user.email || '',
          name: user.name || '',
          image: user.image || '',
          provider: account.provider,
        })
      }
      return true
      // redirect('/FormIsiDataDiri')
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.id = profile.sub || profile.id || '';
        token.provider = account.provider;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        if (account.provider === 'google') {
          token.username = (profile as any).given_name || '';
          token.location = '';
        } else if (account.provider === 'github') {
          token.username = (profile as any).login || '';
          token.location = (profile as any).location || '';
        }
        /* eslint-enable @typescript-eslint/no-explicit-any */
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.username = token.username as string | null
        session.user.location = token.location as string | null
        session.user.provider = token.provider as string
      }
      return session
    },
  },
})