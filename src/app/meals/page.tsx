import { getMenuMakanan } from "@/action/supabaseFunc";
import { auth } from "@/auth";
import CardMenuMakanan from "@/components/CardMenuMakanan";
import { redirect } from "next/navigation";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu Makanan — Neurofit",
  description:
    "Lihat menu makanan sehat personal Anda yang direkomendasikan oleh Neurofit AI, lengkap dengan makro nutrisi dan kebutuhan kalori harian.",
  keywords: [
    "menu makanan sehat",
    "rekomendasi diet AI",
    "nutrisi makro",
    "tracking kalori",
    "meal plan fitness",
    "Neurofit meals",
    "asupan kalori harian",
  ],
  robots: {
    index: false, // privat → jangan di-index search engine
    follow: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};


const page = async() => {
  const session = await auth()
  const userId = session?.user.id;
  const res = await getMenuMakanan(userId!)
  if(!session){
    redirect("/login")
  }
  const menu = res.data
  return (
    <div className='w-full h-full flex justify-between px-8 py-4 flex-wrap gap-4'>
      <CardMenuMakanan menu={menu?.[0] ?? null} />
    </div>
  )
}

export default page
