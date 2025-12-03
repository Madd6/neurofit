import { Suspense } from 'react';
import type { Metadata } from "next";
import LoginClient from '@/app/(auth)/login/LoginClient';

export const metadata: Metadata = {
  title: "Masuk ke Neurofit — Asisten Diet & Fitness AI",
  description:
    "Masuk ke Neurofit menggunakan OAuth Google atau GitHub untuk memulai perjalanan diet dan fitness Anda, termasuk perhitungan BMI, TDEE, dan rekomendasi nutrisi berbasis AI.",
  keywords: [
    "login neurofit",
    "oauth google github",
    "asisten diet AI",
    "fitness AI rekomendasi",
    "tracking kalori",
    "hitung BMI TDEE",
    "pola hidup sehat",
  ],
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function Page() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginClient />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className="container h-[80vh] w-[80%] rounded-2xl flex justify-between items-center">
        <div className="flex flex-col h-full lg:w-[40%] w-full items-center justify-center bg-gray-800 rounded-2xl animate-pulse">
          <div className='w-[90%] flex flex-col justify-center items-center h-full gap-4'>
            <div className='h-8 w-3/4 bg-gray-700 rounded'></div>
            <div className='h-6 w-2/3 bg-gray-700 rounded'></div>
            <div className='flex flex-col w-[90%] gap-3 mt-8'>
              <div className='h-12 bg-gray-700 rounded'></div>
              <div className='h-12 bg-gray-700 rounded'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}