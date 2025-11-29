import { getPersonalData } from '@/action/supabaseFunc'
import { auth } from '@/auth'
import FormPersonalizeData from '@/components/form/FormPersonalizeData'
import { redirect } from 'next/navigation'
import React from 'react'

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Isi Data Diri — Neurofit",
  description:
    "Isi dan perbarui profil tubuh Anda di Neurofit untuk mendapatkan rekomendasi diet dan latihan fitness yang lebih personal menggunakan AI.",
  keywords: [
    "form data diri",
    "profil tubuh",
    "hitung BMI",
    "tracking nutrisi AI",
    "rekomendasi diet AI",
    "personal fitness AI",
    "Neurofit data diri",
  ],
  robots: {
    index: false,  // halaman privat → jangan di-index mesin pencari
    follow: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};


const page = async() => {
  const session = await auth()
  if(!session){
    redirect('login')
  }
  const userId = session.user.id;
  const res = await getPersonalData(userId!) || null
  
  const personaldata = res.data
  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
      <FormPersonalizeData personaldata={personaldata?.[0] ?? null} />
    </div>
  )
}

export default page
