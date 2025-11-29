// CardMacro.tsx (CLIENT COMPONENT)
"use client";

import { ChartRadarDefault } from "@/components/ChartsMakro";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
// import Link from "next/link";
import { Calculator, Loader2 } from "lucide-react";
import tdeeCalculator from "@/action/tdeeCalculator";
import { toast } from "sonner";
import { useState } from "react";
import LoadingOverlay from "./loadingOverlay";


interface CardMacroProps {
  tdee: number | null;
  rmr: number | null;
  targetKalori: number | null;
  protein: number | null;
  lemak: number | null;
  karbohidrat: number | null;
}

const CardMacro = (props: CardMacroProps) => {
  const [isLoading,setIsLoading] = useState(false)
  const [initialData,setInitialData] = useState<CardMacroProps>(props)
  const handleTdeeCalculator = async () => {
    setIsLoading(true)
    const res = await tdeeCalculator();
    if (!res.success || !res.data) {
      setIsLoading(false)
      toast.error(res.msg || "Gagal menghitung TDEE");
      return;
    }
    setIsLoading(false)
    setInitialData(res.data)
    toast.success(res.msg || "Berhasil menghitung TDEE");

  };

  const isEmpty =
    initialData.protein === null ||
    initialData.karbohidrat === null ||
    initialData.lemak === null ||
    initialData.targetKalori === null;

  // ✅ Kalau belum ada data makro → tampilkan tombol hitung TDEE
  if (isEmpty) {
    return (
      <>
      {isLoading && <LoadingOverlay />}
      <div className="px-4 py-8 w-full md:min-h-screen flex justify-center items-center ">
        <Card className="w-70 md:h-[570px] h-[300px] overflow-hidden border-0 
          [clip-path:path('M_0,20_A_20,20_0,0,1_20,0_L_165,0_L_175,5_L_190,30_L_200,35_L_260,35_A_20,20_0,0,1_280,55_L_280,280_A_20,20_0,0,1_260,300_L_20,300_A_20,20_0,0,1_0,280_L_0,0_Z')]
          md:[clip-path:path('M_0,20_A_20,20_0,0,1_20,0_L_165,0_L_175,5_L_190,30_L_200,35_L_260,35_A_20,20,0,0,1_280,55_L_280,550_A_20,20_0,0,1_260,570_L_20,570_A_20,20_0,0,1_0,550_L_0,0_Z')]
        ">
          <CardHeader>
            <CardTitle>Kalori & Nutrisi</CardTitle>
            <CardDescription>
              Kebutuhan <span className="text-cyan-400 font-bold">Kalori</span> Dan{" "}
              <span className="text-cyan-400 font-bold">Makronutrisi</span> Harian
            </CardDescription>
          </CardHeader>

          <CardContent className="md:h-[570px] h-[300px]">
            <div className="w-full h-full flex flex-col justify-center items-center text-center gap-4 p-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
                <Calculator className="w-8 h-8 text-muted-foreground" />
              </div>
              <Button
                onClick={handleTdeeCalculator}
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-black hover:opacity-90"
                size="lg"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Calculator />}
              {isLoading ? "Loading..." : "Minta Rekomendasi"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
    );
  }

  // ✅ Data makro tersedia → tampilkan chart + detail
  return (
    <div className="px-4 py-8 w-full md:min-h-screen flex justify-center items-center ">
      <Card className="md:w-70 w-[360px] md:h-[570px] h-[300px] overflow-hidden border-0
        [clip-path:path('M_0,20_A_20,20_0,0,1_20,0_L_165,0_L_175,5_L_190,30_L_200,35_L_340,35_A_20,20_0,0,1_360,55_L_360,280_A_20,20,0,0,1_340,300_L_20,300_A_20,20,0,0,1_0,280_L_0,0_Z')]
        md:[clip-path:path('M_0,20_A_20,20_0,0,1_20,0_L_165,0_L_175,5_L_190,30_L_200,35_L_260,35_A_20,20,0,0,1_280,55_L_280,550_A_20,20,0,0,1_260,570_L_20,570_A_20,20,0,0,1_0,550_L_0,0_Z')]
      ">
        <CardHeader>
          <CardTitle>Kalori & Nutrisi</CardTitle>
          <CardDescription>
            Kebutuhan <span className="text-cyan-400 font-bold">Kalori</span> Dan{" "}
            <span className="text-cyan-400 font-bold">Makronutrisi</span> Harian
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartRadarDefault
            protein={initialData.protein!}
            lemak={initialData.lemak!}
            karbohidrat={initialData.karbohidrat!}
          />
          <div className="bg-background/60 p-4 rounded-xl my-4">
            <p className="text-cyan-400 text-lg font-bold">{initialData.targetKalori} kcal</p>
            <p className="text-gray-400 text-sm">Target Kalori</p>

            <div className="flex gap-6 mt-4">
              <div className="text-center">
                <p className="text-cyan-300 text-sm font-bold">{initialData.protein} gr</p>
                <p className="text-gray-400 text-xs">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-purple-400 text-sm font-bold">{initialData.lemak} gr</p>
                <p className="text-gray-400 text-xs">Fat</p>
              </div>
              <div className="text-center">
                <p className="text-lime-400 text-sm font-bold">{initialData.karbohidrat} gr</p>
                <p className="text-gray-400 text-xs">Carbs</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardMacro;
