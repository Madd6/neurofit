// src/types/next-auth.d.ts

import { DefaultSession } from "next-auth";
import { JWT as NextAuthJWT } from "next-auth/jwt";

// 1. Perluas Interface Session (Apa yang dilihat client/frontend)
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // <-- Menambahkan ID ke session.user
    } & DefaultSession["user"];
    accessToken?: string; // <-- Menambahkan accessToken ke session
  }
}

// 2. Perluas Interface JWT (Apa yang digunakan di backend/callbacks)
declare module "next-auth/jwt" {
  interface JWT extends NextAuthJWT {
    id: string; // <-- Menambahkan ID ke token
    accessToken?: string; // <-- Menambahkan accessToken ke token
  }
}
