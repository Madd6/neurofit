import {  getPersonalData } from "@/action/supabaseFunc";
import { auth } from "@/auth";
import Image from "next/image";
import illustrationFitness from '../assets/freepik__background__21679.png';
// import illustrationFitness from '../assets/freepik__background__65885.png';
import japaneseText from '../assets/freepik__background__7492.png';
import futuristicIcon from '../assets/futuristicIcon.svg';
import { orbitron, sterion } from "./layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Dumbbell,
  Hourglass,
  Ruler,
  Scale,
  Activity,
  VenusAndMars,
} from "lucide-react";
import CardMacroWrapper from "@/components/cardMacroWrapper";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neurofit — Rekomendasi Diet & Fitness Berbasis AI",
  description:
    "Neurofit adalah sistem asisten diet & fitness berbasis AI yang membantu menghitung BMI, tracking kalori harian, menghitung TDEE, serta memberi rekomendasi makanan dan olahraga yang personal dan optimal.",
  keywords: [
    "diet AI",
    "fitness AI",
    "hitung BMI",
    "TDEE calculator",
    "tracking kalori",
    "rekomendasi makanan sehat",
    "olahraga berdasarkan AI",
    "asisten diet",
    "nutrisi harian",
    "kesehatan tubuh",
  ],
  authors: [{ name: "Madd" }],
  metadataBase: new URL("https://neurofit-one.vercel.app"),

  // openGraph: {
  //   title: "Neurofit — Optimize Your Body System with AI",
  //   description:
  //     "Dapatkan rekomendasi diet & fitness yang sesuai tubuh kamu. Hitung BMI, TDEE, track kalori dan makro nutrisi harian secara cerdas menggunakan AI.",
  //   url: "",
  //   siteName: "Neurofit",
  //   images: [
  //     {
  //       url: "./assets/og-home.jpg",
  //       width: 720,
  //       height: 570,
  //       alt: "Neurofit Diet & Fitness AI Illustration",
  //     },
  //   ],
  //   locale: "id_ID",
  //   type: "website",
  // },

  // twitter: {
  //   card: "summary_large_image",
  //   title: "Neurofit — Rekomendasi Diet & Fitness AI",
  //   description:
  //     "Hitung BMI, TDEE dan makro nutrisi kamu lalu dapatkan personal AI recommendations untuk makanan & olahraga.",
  //   images: ["./assets/og-home.jpg"],
  // },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "",
  },

  icons: {
    icon: "./favicon.ico",
    apple: "./apple-icon.png",
  },
};

const hitungBMI = ({tinggiBadan,beratBadan}:{tinggiBadan:number,beratBadan:number} ) =>{
  const tinggiDalamMeter = tinggiBadan / 100;
  const bmi = Math.ceil(beratBadan / (tinggiDalamMeter * tinggiDalamMeter));
  return bmi;
}

function getAge(birthDate: string | Date): number {
  const b = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - b.getFullYear();
  const monthDiff = today.getMonth() - b.getMonth();
  const dayDiff = today.getDate() - b.getDate();

  // kalau ulang tahun BELUM lewat tahun ini → kurangi 1
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

export default async function Home() {
  const session = await auth()
  // console.log("session home", session);
  const userId = session?.user.id;
  const res = await getPersonalData(userId!);
  const personalInfo = res.data
  const age = getAge(personalInfo?.[0]?.tanggalLahir ?? "2025-01-01");
  const bmi = personalInfo && personalInfo.length > 0
  ?  hitungBMI({
      tinggiBadan: personalInfo[0].tinggiBadan,
      beratBadan: personalInfo[0].beratBadan
    })
  : null;

  return (
    <div className={`flex md:flex-row flex-col items-center justify-center w-full min-h-screen relative md:overflow-y-hidden ${orbitron.className}`}>
      
      <div className="md:px-4 px-0 md:py-8 py-2 md:mt-0 mt-20 w-full md:h-screen h-[60vh] flex justify-center items-center ">
        <div className="md:w-70 w-[360px] h-[570px] overflow-hidden border-0 
        [clip-path:path('M_0,55_A_20,20_0,0,1_20,35_L_90,35_L_100,30_L_120,5_L_130,0_L_340,0_A_20,20_0,0,1_360,20_L_360,480_A_20,20_0,0,1_340,500_L_20,500_A_20,20_0,0,1_0,480_L_0,35_Z')]
        md:[clip-path:path('M_0,55_A_20,20_0,0,1_20,35_L_90,35_L_100,30_L_120,5_L_130,0_L_260,0_A_20,20_0,0,1_280,20_L_280,550_A_20,20_0,0,1_260,570_L_20,570_A_20,20_0,0,1_0,550_L_0,35_Z')]
       " >
          <div className="w-full md:h-[70%] h-[55%]  bg-card rounded-xl px-6">
            <div className={`w-full text-end  py-4 font-semibold `}>Profil User</div>
            {personalInfo && personalInfo.length > 0 ? (
              <div className="bg-background/50 rounded-xl p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="opacity-70 text-xs flex gap-2"><Hourglass /> Usia</span>
                    <span className="font-bold text-sm text-cyan-600 dark:text-cyan-400">{age}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="opacity-70 text-xs flex gap-2"><VenusAndMars /> Gender</span>
                    <span className="font-bold text-sm text-cyan-600 dark:text-cyan-400">{personalInfo[0].gender}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="opacity-70 text-xs flex gap-2"><Ruler /> Tinggi</span>
                    <span className="font-bold text-sm text-cyan-600 dark:text-cyan-400">{personalInfo[0].tinggiBadan} cm</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="opacity-70 text-xs flex gap-2"><Scale /> Berat</span>
                    <span className="font-bold text-sm text-cyan-600 dark:text-cyan-400">{personalInfo[0].beratBadan} kg</span>
                  </div>

                  {/* ✅ BMI sudah dihitung di atas, tinggal tampil */}
                  <div className="flex justify-between">
                    <span className="opacity-70 text-xs flex gap-2"><Activity /> BMI</span>
                    <span className="font-bold text-sm text-cyan-600 dark:text-cyan-400">{bmi}</span>
                  </div>
                </div>
              </div>
            ) : (
              // ✅ Ini branch kosong saat tidak ada data
              <div className="w-full flex flex-col justify-center items-center text-center gap-2 text-gray-400">
                <Dumbbell className="w-8 h-8 opacity-40" />
                <p className="font-semibold text-lg">Profile tubuh belum ada</p>
                <p className="text-sm">Silakan isi data diri dulu untuk mendapat rekomendasi</p>
                <Link href={!session?"/login":"/FormIsiDataDiri"}>
                <Button className={`${!session?"bg-violet-700":"bg-lime-400"}`}>{!session?"login":"Isi Data Diri"}</Button>
                </Link>
              </div>
            )}

            
           {personalInfo && personalInfo.length > 0 && <div className="w-full h-15 flex justify-between items-center px-4 py-2 -translate-y-2 md:-translate-y-0">
              <Link href={'/FormIsiDataDiri'} className=" relative">
                {/* <div className="bg-cyan-500/40 px-2 py-1 h-[40px] w-[150px] text-foreground text-center absolute top-0 left-0 flex justify-center items-center transition-all 
                hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]  hover:text-cyan-100  " style={{
                  clipPath:'path("M 0,20 L 20,0 L 150,0 L 150,20 L 130,40 L 0,40 L 0,0 Z")'
                }}>
                  <div className="w-full h-full border-2 border-l-[3px] border-cyan-400/50 absolute"></div>
                  <div className="w-full h-27 border-4 border-cyan-400/50 absolute -rotate-[44deg]"></div>
                  Edit Profile
                </div> */}
                <Button className="text-foreground border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground  dark:border-cyan-400 dark:hover:bg-cyan-400/50">Edit Profile</Button>
              </Link>
              {/* <ToastButton /> */}
            </div>}
          </div>
          <div className="w-full md:h-[30%] h-[190px] flex justify-between items-center pt-4 ">
            <div className="relative">
              <div className=" md:w-[130px] w-[170px] bg-card md:h-[150px] h-[170px] rounded-xl flex justify-end items-end overflow-hidden text-sm font-bold px-4 py-2 relative text-foreground
              [clip-path:path('M_0,20_A_20,20_0,0,1_20,0_L_90,0_A_10,10_0,0,1_100,10_L_100,30_A_10,10_0,0,0_110,40_L_160,40_A_10,10_0,0,1_170,50_L_170,150_A_20,20_0,0,1_150,170_L_20,170_A_20,20_0,0,1_0,150_Z')]
              md:[clip-path:path('M_0,20_A_20,20_0,0,1_20,0_L_50,0_A_10,10_0,0,1_60,10_L_60,30_A_10,10_0,0,0_70,40_L_120,40_A_10,10_0,0,1_130,50_L_130,130_A_20,20_0,0,1_110,150_L_20,150_A_20,20_0,0,1_0,130_L_0,20_Z')]
              ">
                食 AI Meals
              </div>
                <Link href={"/meals"}>
                  <Button className="absolute top-0 right-0 bg-cyan-400 cursor-pointer  shadow-[-6px_6px_18px_rgba(0,255,255,0.15)] shadow-cyan-300 w-16 text-center" size={"icon"}>Meals</Button>
                </Link>
            </div>
            <div className="relative">
              <div className=" md:w-[130px] w-[170px] bg-card md:h-[150px] h-[170px] rounded-xl flex justify-end items-end overflow-hidden text-sm font-bold px-4 py-2 relative text-foreground
              [clip-path:path('M_0,20_A_20,20_0,0,1_20,0_L_90,0_A_10,10_0,0,1_100,10_L_100,30_A_10,10_0,0,0_110,40_L_160,40_A_10,10_0,0,1_170,50_L_170,150_A_20,20_0,0,1_150,170_L_20,170_A_20,20_0,0,1_0,150_Z')]
              md:[clip-path:path('M_0,20_A_20,20_0,0,1_20,0_L_50,0_A_10,10_0,0,1_60,10_L_60,30_A_10,10_0,0,0_70,40_L_120,40_A_10,10_0,0,1_130,50_L_130,130_A_20,20_0,0,1_110,150_L_20,150_A_20,20_0,0,1_0,130_L_0,20_Z')]
              ">
                体 AI Fitness
              </div>
                <Link href={"/fitnes"}>
                  <Button className="absolute top-0 right-0 bg-violet-700 cursor-pointer shadow-[-6px_6px_18px_rgba(0,255,255,0.15)] shadow-violet-600 w-16 text-center"  size={"icon"}>Fitness</Button>
                </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="relative ">
        <div className="md:w-[720px] w-[360] bg-card md:h-[570px] h-[500px] overflow-hidden flex justify-center items-center
          [clip-path:path('M_330,20_A_20,20_0,0,1_350,0_L_340,0_A_20,20_0,0,1_360,20_L_360,480_A_20,20_0,0,1_340,500_L_20,500_A_20,20_0,0,1_0,480_L_0,200_A_20,20_0,0,1_20,180_L_230,180_L_240,175_L_240,175_L_325,60_L_325,60_L_330,50_L_330,20_Z')]
          md:[clip-path:path('M_330,20_A_20,20_0,0,1_350,0_L_700,0_A_20,20_0,0,1_720,20_L_720,550_A_20,20_0,0,1_700,570_L_20,570_A_20,20_0,0,1_0,550_L_0,200_A_20,20_0,0,1_20,180_L_230,180_L_240,175_L_240,175_L_325,60_L_325,60_L_330,50_L_330,20_Z')]
        ">
          <Image src={illustrationFitness} alt="illustration fitness " quality={80} width={720} height={570} style={{objectFit: 'cover'}} sizes="(min-width: 1024px) 720px, (min-width: 768px) 480px, 100vw" priority fetchPriority="high"  className="w-full absolute md:top-0 top-35"/>
          <h1 className={`absolute bottom-10 md:right-10 right-25 md:text-8xl text-4xl font-bold italic text-foreground ${sterion.className}`}>NEUROFIT</h1>
        </div>
        <div className="w-[300px] h-[150px] bg-card absolute top-0" style={{
          clipPath: 'path("M 0,20 A 20,20 0,0,1 20,0 L 280,0 A 20,20 0,0,1 300,20 L 300,50 L 295,60 L 230,145 L 220,150 L 20,150 A 20,20 0,0,1 0,130 L 0,20 Z")',
        }}>
          <div className="relative w-full h-full scale-75 opacity-85">
            <Image src={futuristicIcon} loading="lazy" alt="futuristicIcon " width={300} height={150} style={{objectFit: 'cover'}} sizes="(min-width: 1024px) 360px, (min-width: 768px) 240px, 10vw" className="absolute scale-70 rotate-90 -translate-y-20 translate-x-20 "/>
            <Image src={japaneseText} loading="lazy" alt="Japanese Icon " width={300} height={150} style={{objectFit: 'cover'}} sizes="(min-width: 1024px) 360px, (min-width: 768px) 240px, 10vw" className="absolute scale-70 -translate-y-17  -translate-x-12 invert dark:invert-0"/>
          </div>
        </div>
      </div>
        <CardMacroWrapper />
    </div>
  );
}
