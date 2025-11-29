import { getDetailLatihan } from '@/action/supabaseFunc';
import { auth } from '@/auth';
import CardLatihan from '@/components/CardLatihan';
import React from 'react'
import { redirect } from 'next/navigation';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Latihan — Neurofit",
  description:
    "Lihat daftar dan detail latihan fitness personal Anda yang direkomendasikan oleh Neurofit AI berdasarkan kondisi tubuh dan tujuan kesehatan Anda.",
  keywords: [
    "latihan fitness personal",
    "workout tracking",
    "rekomendasi latihan AI",
    "program latihan",
    "fitness sehat",
    "Neurofit latihan",
  ],
  robots: {
    index: false,  // karena ini halaman privat (butuh auth) → jangan di-index Google
    follow: false,
  },
  icons: {
    icon: "/favicon.ico",              // simpan di public/
    apple: "/apple-touch-icon.png",    // simpan di public/
  },
};


const page = async() => {
  const session = await auth()
  
  if(!session){
    redirect("/login")
  }
  const userId = session.user.id;

  const res = await getDetailLatihan(userId)
  
  return (
    <div className='w-full h-full flex justify-between px-8 py-4 flex-wrap gap-4'>
      {/* ✅ PERBAIKAN: Cast props to any to match component's prop type or update CardLatihan's props interface */}
      <CardLatihan Dlatihan={res.data ?? null} />
    </div>
  )
}

export default page