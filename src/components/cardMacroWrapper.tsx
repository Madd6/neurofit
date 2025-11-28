// CardMacroWrapper.tsx (SERVER COMPONENT)
import CardMacro from './CardMacro'
import { auth } from '@/auth';
import { getMakronutrisi } from '@/action/supabaseFunc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CardMacroWrapper = async () => {
  const session = await auth();
  const userId = session?.user.id;

  // ✅ Jika belum login
  if (!session || !userId) {
    return (
      <div className="px-4 py-8 w-full md:min-h-screen flex justify-center items-center ">
        <Card className="w-70 md:h-[570px] h-[300px] overflow-hidden border-0 
          [clip-path:path('M_0,20_A_20,20_0,0,1_20,0_L_165,0_L_175,5_L_190,30_L_200,35_L_260,35_A_20,20_0,0,1_280,55_L_280,280_A_20,20_0,0,1_260,300_L_20,300_A_20,20_0,0,1_0,280_L_0,0_Z')]
          md:[clip-path:path('M_0,20_A_20,20_0,0,1_20,0_L_165,0_L_175,5_L_190,30_L_200,35_L_260,35_A_20,20,0,0,1_280,55_L_280,550_A_20,20_0,0,1_260,570_L_20,570_A_20,20_0,0,1_0,550_L_0,0_Z')]
        ">
          <CardHeader>
            <CardTitle>Kalori & Nutrisi</CardTitle>
            <CardDescription>
              Kebutuhan <span className="text-cyan-400 font-bold">Kalori</span> dan{" "}
              <span className="text-cyan-400 font-bold">Makronutrisi</span> Harian
            </CardDescription>
          </CardHeader>
          <CardContent className="md:h-[570px] h-[300px]">
            <div className="w-full h-full flex flex-col justify-center items-center text-center gap-2">
              <p>Data Tidak Ditemukan</p>
              <p>
                Tolong <span className="text-violet-700">login</span> dan isi data diri Anda
              </p>
              <Link href="/login">
                <Button className="bg-violet-700">Login</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ Sudah login, ambil data makro
  const resMacro = await getMakronutrisi(userId);

  if (!resMacro.success || !resMacro.data || resMacro.data.length === 0) {
    // data makro belum ada → kirim nilai null supaya CardMacro tampilkan tombol "Calculate TDEE"
    return (
      <CardMacro
        tdee={null}
        rmr={null}
        targetKalori={null}
        protein={null}
        lemak={null}
        karbohidrat={null}
      />
    );
  }

  const macro = resMacro.data[0];

  return (
    <CardMacro
      tdee={macro.tdee ?? null}
      rmr={macro.rmr ?? null}
      targetKalori={macro.targetKalori ?? null}
      protein={macro.protein ?? null}
      lemak={macro.lemak ?? null}
      karbohidrat={macro.karbohidrat ?? null}
    />
  );
};

export default CardMacroWrapper;
