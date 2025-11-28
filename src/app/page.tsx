import { getMakronutrisi, getPersonalData } from "@/action/supabaseFunc";
import { auth } from "@/auth";
import CardMacro from "@/components/CardMacro";
import Image from "next/image";
import illustrationFitness from '../assets/freepik__background__65885.png';
import INI from '../assets/INI.png';
import molekulLine from '../assets/freepik__background__47176.png';
import japaneseText from '../assets/freepik__background__7492.png';
import futuristicIcon from '../assets/futuristicIcon.svg';
import { orbitron, sterion } from "./layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OneShotToast } from "@/components/OneShootToast";
import { Dumbbell } from "lucide-react";

const hitungBMI = async({tinggiBadan,beratBadan}:{tinggiBadan:number,beratBadan:number} ) =>{
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
  console.log("session home", session);
  const userId = session?.user.id;
  const res = await getPersonalData(userId!);
  const personalInfo = res.data
  const resMacro = await getMakronutrisi(userId!);
  if(!resMacro.success || !resMacro.data){
    <OneShotToast message={resMacro.msg || "Gagal mengambil data Makronutrisi"} />
  }
  const macro = resMacro.data
  const age = getAge(personalInfo?.[0]?.tanggalLahir ?? "2025-01-01");
  const bmi = personalInfo && personalInfo.length > 0
  ? await hitungBMI({
      tinggiBadan: personalInfo[0].tinggiBadan,
      beratBadan: personalInfo[0].beratBadan
    })
  : null;

  return (
    <div className={`flex md:flex-row flex-col items-center justify-center w-full min-h-screen relative md:overflow-y-hidden ${orbitron.className}`}>
      
      <div className="px-4 py-8 md:mt-0 mt-36 w-full md:h-screen h-[60vh] flex justify-center items-center">
        <div className="w-70 h-[570px]  overflow-hidden border-0 
        [clip-path:path('M_0,55_A_20,20_0,0,1_20,35_L_90,35_L_100,30_L_120,5_L_130,0_L_260,0_A_20,20_0,0,1_280,20_L_280,480_A_20,20_0,0,1_260,500_L_20,500_A_20,20_0,0,1_0,480_L_0,35_Z')]
        md:[clip-path:path('M_0,55_A_20,20_0,0,1_20,35_L_90,35_L_100,30_L_120,5_L_130,0_L_260,0_A_20,20_0,0,1_280,20_L_280,550_A_20,20_0,0,1_260,570_L_20,570_A_20,20_0,0,1_0,550_L_0,35_Z')]
       " >
          <div className="w-full md:h-[70%] h-[55%]  bg-card rounded-xl px-2">
            <div className={`w-full text-end px-4 py-4  font-semibold `}>Profil User</div>
            {personalInfo && personalInfo.length > 0 ? (
              <div className="bg-background/50 rounded-xl p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="opacity-70 text-xs">Usia</span>
                    <span className="font-bold text-cyan-400">{age}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="opacity-70 text-xs">Gender</span>
                    <span className="font-bold text-cyan-400">{personalInfo[0].gender}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="opacity-70 text-xs">Tinggi</span>
                    <span className="font-bold text-cyan-400">{personalInfo[0].tinggiBadan} cm</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="opacity-70 text-xs">Berat</span>
                    <span className="font-bold text-cyan-400">{personalInfo[0].beratBadan} kg</span>
                  </div>

                  {/* ✅ BMI sudah dihitung di atas, tinggal tampil */}
                  <div className="flex justify-between">
                    <span className="opacity-70 text-xs">BMI</span>
                    <span className="font-bold text-cyan-400">{bmi}</span>
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

            
           {personalInfo && personalInfo.length > 0 && <div className="w-full h-15 flex justify-between items-center px-4 py-2">
              <Link href={'/FormIsiDataDiri'} className=" relative">
                <div className="bg-cyan-500/50 px-2 py-1 h-[40px] w-[150px] text-foreground text-center absolute top-0 left-0 flex justify-center items-center transition-all 
                hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]  hover:text-cyan-100  " style={{
                  clipPath:'path("M 0,20 L 20,0 L 150,0 L 150,20 L 130,40 L 0,40 L 0,0 Z")'
                }}>
                  <div className="w-full h-full border-2 border-l-[3px] border-cyan-400 absolute"></div>
                  <div className="w-full h-27 border-4 border-cyan-400 absolute -rotate-[44deg]"></div>
                  Edit Profile
                </div>
              </Link>
              {/* <ToastButton /> */}
            </div>}
          </div>
          <div className="w-full h-[30%] flex justify-between items-center pt-4 ">
            <div className="relative">
              <div className=" w-[130px] text-background bg-cyan-400/60 h-[150px] rounded-xl flex justify-end items-end overflow-hidden text-sm font-bold px-4 py-2 relative" style={{
                clipPath:'path("M 0,20 A 20,20 0,0,1 20,0 L 80,0 A 10,10 0,0,1 90,10 L 90,30 A 10,10 0,0,0 100,40 L 120,40 A 10,10 0,0,1 130,50 L 130,130 A 20,20 0,0,1 110,150 L 20,150 A 20,20 0,0,1 0,130 L 0,20  Z")'
              }}>
                <div className="border-2 border-black w-20 h-20 absolute top-0 right-0" ></div>
                <div className="border-2 border-black w-10 h-10 absolute top-15 left-10" ></div>
                <div className="border-2 border-white w-15 h-15 absolute top-5 left-5" ></div>
                {/* <div className="text-cyan-400 text-7xl mb-3 absolute bottom-12">🍱</div> */}
                食 AI Meals
              </div>
                <Link href={"/meals"}>
                  <Button className="absolute top-0 right-0 bg-cyan-400 cursor-pointer  shadow-[-6px_6px_18px_rgba(0,255,255,0.15)] shadow-cyan-300" size={"icon"}>Go</Button>
                </Link>
            </div>
            <div className="relative">
              <div className="w-[130px] text-background bg-violet-700/60 h-[150px] rounded-xl flex justify-end items-end overflow-hidden text-sm font-bold px-4 py-2 relative" style={{
                clipPath:'path("M 0,20 A 20,20 0,0,1 20,0 L 80,0 A 10,10 0,0,1 90,10 L 90,30 A 10,10 0,0,0 100,40 L 120,40 A 10,10 0,0,1 130,50 L 130,130 A 20,20 0,0,1 110,150 L 20,150 A 20,20 0,0,1 0,130 L 0,20  Z")'
              }}>
                <div className="border-2 border-black w-15 h-15 absolute top-0 right-0" ></div>
                <div className="border-2 border-white w-10 h-10 absolute top-10 right-10" ></div>
                <div className="border-2 border-black w-20 h-20 absolute top-5 left-0" ></div>
                体 AI Fitness
              </div>
                <Link href={"/fitnes"}>
                  <Button className="absolute top-0 right-0 bg-violet-700 cursor-pointer  shadow-[-6px_6px_18px_rgba(0,255,255,0.15)] shadow-violet-600"  size={"icon"}>Go</Button>
                </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="relative scale-75 md:scale-100">
        <div className="md:w-[720px] w-[360] bg-card md:h-[570px] h-[500px] overflow-hidden flex justify-center items-center
          [clip-path:path('M_330,20_A_20,20_0,0,1_350,0_L_340,0_A_20,20_0,0,1_360,20_L_360,480_A_20,20_0,0,1_340,500_L_20,500_A_20,20_0,0,1_0,480_L_0,200_A_20,20_0,0,1_20,180_L_230,180_L_240,175_L_240,175_L_325,60_L_325,60_L_330,50_L_330,20_Z')]
          md:[clip-path:path('M_330,20_A_20,20_0,0,1_350,0_L_700,0_A_20,20_0,0,1_720,20_L_720,550_A_20,20_0,0,1_700,570_L_20,570_A_20,20_0,0,1_0,550_L_0,200_A_20,20_0,0,1_20,180_L_230,180_L_240,175_L_240,175_L_325,60_L_325,60_L_330,50_L_330,20_Z')]
        ">
          <h1 className={`absolute bottom-10 right-10 md:text-8xl text-4xl font-bold italic text-foreground ${sterion.className}`}>NEUROFIT</h1>
          
          <Image src={molekulLine} alt="illustration fitness" width={720} height={570} style={{objectFit: 'cover'}} className="absolute right-0 md:top-0 bottom-0 md:-translate-y-20 -translate-y-10 md:scale-125 scale-150  invert dark:invert-0 rotate-90" />
          {/* <Image src={futuristicIcon} alt="illustration fitness " width={720} height={570} style={{objectFit: 'cover'}} className="scale-65 -translate-x-10 translate-y-5 absolute text-foreground "/> */}
          <Image src={illustrationFitness} alt="illustration fitness " width={720} height={570} style={{objectFit: 'cover'}} className="md:scale-65 scale-75 md:translate-x-33 translate-x-16 md:translate-y-5 translate-y-35 hue-rotate-90 "/>
          <div className={`absolute md:bottom-5 md:left-5 left-0 bottom-0 flex flex-col justify-center items-start gap-2 text-xs font-extralight text-shadow-sm md:scale-100 scale-[65%] md:translate-y-0 translate-y-5 md:-translate-x-0 -translate-x-10 ${orbitron.className}`}>
            <p className="bg-background/80 rounded-sm px-4 py-2">OPTIMIZE YOUR <span className="text-violet-600">BODY SYSTEM</span></p>
            <p className="bg-background/80 rounded-sm px-4 py-2">UPGRADE YOUR <span className="text-violet-600">DAILY ROUTINE</span></p>
            <p className="bg-background/80 rounded-sm px-4 py-2">CALIBRATE YOUR <span className="text-violet-600">ENERGY INPUT</span></p>
            <p className="bg-background/80 rounded-sm px-4 py-2">EXECUTE THE <span className="text-violet-600">DISCIPLINE PROTOCOL</span></p>
          </div>
          {/* <Image src={xxxx} alt="XXXX" width={100} height={100} className="absolute bottom-20 left-4 rotate-90 invert dark:invert-0"/> */}
          <Image src={INI} alt="INI" width={50} height={50} className="absolute md:top-4 top-40 right-4 invert dark:invert-0"/>
        </div>
        <div className="w-[300px] h-[150px] bg-card absolute top-0" style={{
          clipPath: 'path("M 0,20 A 20,20 0,0,1 20,0 L 280,0 A 20,20 0,0,1 300,20 L 300,50 L 295,60 L 230,145 L 220,150 L 20,150 A 20,20 0,0,1 0,130 L 0,20 Z")',
        }}>
          <div className="relative w-full h-full">
            <Image src={futuristicIcon} alt="illustration fitness " width={300} height={150} style={{objectFit: 'cover'}} className="absolute scale-70 rotate-90 -translate-y-20 translate-x-20 "/>
            <Image src={japaneseText} alt="illustration fitness " width={300} height={150} style={{objectFit: 'cover'}} className="absolute scale-70 -translate-y-17  -translate-x-12 invert dark:invert-0"/>
          </div>
        </div>
      </div>
        <CardMacro {...(macro?.[0] ?? {
          tdee: null,
          rmr: null,
          targetKalori: null,
          protein: null,
          lemak: null,
          karbohidrat: null
        })}/>
    </div>
  );
}
