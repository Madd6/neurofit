import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

type User = {
  id: string,
  name: string,
  email: string,
  image?: string,
}

 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google,GitHub,
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials, req) => {
        let user: User | null = null
        const email = "admin@Adamin.com"
        const password = "admin123"
        // Simulate a user lookup, replace with your actual user lookup logic
        if (credentials?.email === email && credentials?.password === password) {
          user = {
            id: "1",
            name: "Admin",
            email: email,
          }
        }
  
 
        // logic to salt and hash password
        // const pwHash = saltAndHashPassword(credentials.password)
 
        // logic to verify if the user exists
        // user = await getUserFromDb(credentials.email, pwHash)
 
        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          return null
        }
 
        return user
      },
    })
  ],
})