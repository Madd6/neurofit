import { ChartRadarDefault } from "@/components/ChartsMakro";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { schemaMakronutrisi } from "@/types/schemaResponseAi";

const CardMacro = async(macro:schemaMakronutrisi) => {
  if (!macro) return (
    <div className="px-4 py-8 w-full md:min-h-screen flex justify-center items-center ">
      <Card className="w-70 md:h-[570px] h-[300px] overflow-hidden border-0 
        [clip-path:path('M_0,20_A_20,20_0,0,1_20,0_L_165,0_L_175,5_L_190,30_L_200,35_L_260,35_A_20,20_0,0,1_280,55_L_280,280_A_20,20_0,0,1_260,300_L_20,300_A_20,20_0,0,1_0,280_L_0,0_Z')]
        md:[clip-path:path('M_0,20_A_20,20_0,0,1_20,0_L_165,0_L_175,5_L_190,30_L_200,35_L_260,35_A_20,20_0,0,1_280,55_L_280,550_A_20,20_0,0,1_260,570_L_20,570_A_20,20_0,0,1_0,550_L_0,0_Z')]
      ">
        <CardHeader>
          <CardTitle>Kalori & Nutrisi</CardTitle>
          <CardDescription>Kebutuhan <span className="text-cyan-400 font-bold">Kalori</span> Dan <span className="text-cyan-400 font-bold">Makronutrisi</span> Harian</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Data Tidak Ditemukan</p>
            <p>Tolong login dan isi data diri Anda</p>
        </CardContent>
        </Card>
    </div>
  )
  return (
    <div className="px-4 py-8 w-full md:min-h-screen flex justify-center items-center ">
      <Card className="w-70 md:h-[570px] h-[300px] overflow-hidden border-0[clip-path:path('M_0,20_A_20,20_0,0,1_20,0_L_165,0_L_175,5_L_190,30_L_200,35_L_260,35_A_20,20_0,0,1_280,55_L_280,280_A_20,20_0,0,1_260,300_L_20,300_A_20,20_0,0,1_0,280_L_0,0_Z')]
        md:[clip-path:path('M_0,20_A_20,20_0,0,1_20,0_L_165,0_L_175,5_L_190,30_L_200,35_L_260,35_A_20,20_0,0,1_280,55_L_280,550_A_20,20_0,0,1_260,570_L_20,570_A_20,20_0,0,1_0,550_L_0,0_Z')]">
        <CardHeader>
          <CardTitle>Kalori & Nutrisi</CardTitle>
          <CardDescription>Kebutuhan <span className="text-cyan-400 font-bold">Kalori</span> Dan <span className="text-cyan-400 font-bold">Makronutrisi</span> Harian</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartRadarDefault protein={macro.protein} lemak={macro.lemak} karbohidrat={macro.karbohidrat} />
          {/* <div className="w-full h-15 flex gap-1 my-4"> 
            <div className="flex-1 flex-col w-1/3 text-center bg-secondary/90 rounded-md py-2">
              <h1 className="font-medium text-md text-cyan-400">{macro.targetKalori} kcal</h1>
              <span className="text-xs font-light text-foreground/50">Target Kalori</span>
            </div>
            
          </div> */}
          {/* <div className="w-full h-15 flex gap-1 my-4">
            <div className="flex-1 flex-col w-1/3 text-center bg-secondary/90 rounded-md py-2">
              <h1 className="font-medium text-md text-emerald-300">{macro.protein} gr</h1>
              <span className="text-xs font-light text-foreground/50">Protein</span>              
            </div>
            <div className="flex-1 flex-col w-1/3 text-center bg-secondary/90 rounded-md py-2">
              <h1 className="font-medium text-md text-emerald-300">{macro.lemak} gr</h1>
              <span className="text-xs font-light text-foreground/50">Fat</span>              
            </div>
            <div className="flex-1 flex-col w-1/3 text-center bg-secondary/90 rounded-md py-2">
              <h1 className="font-medium text-md text-emerald-300">{macro.karbohidrat} gr</h1>
              <span className="text-xs font-light text-foreground/50">Carbs</span>              
            </div>
          </div> */}
          <div className="bg-background/60 p-4 rounded-xl my-4">
              <p className="text-cyan-400 text-lg font-bold">{macro.targetKalori} kcal</p>
              <p className="text-gray-400 text-sm">Target Kalori</p>

              <div className="flex gap-6 mt-4">
                <div className="text-center">
                  <p className="text-cyan-300 text-sm font-bold">{macro.protein} gr</p>
                  <p className="text-gray-400 text-xs">Protein</p>
                </div>
                <div className="text-center">
                  <p className="text-purple-400 text-sm font-bold">{macro.lemak} gr</p>
                  <p className="text-gray-400 text-xs">Fat</p>
                </div>
                <div className="text-center">
                  <p className="text-lime-400 text-sm font-bold">{macro.karbohidrat} gr</p>
                  <p className="text-gray-400 text-xs">Carbs</p>
                </div>
              </div>
            </div>
          {/* <div className="w-full h-15 flex gap-1 my-4">
            <div className="flex-1 flex-col w-1/3 text-center">
              <h1 className="font-medium text-md">{macro.targetKalori}</h1>
              <span className="text-xs font-light text-foreground/50">Target Kalori</span>              
            </div>
            <div className="flex-1 flex-col w-1/3 text-center">
              <h1 className="font-medium text-md">{macro.tdee}</h1>
              <span className="text-xs font-light text-foreground/50">TDEE</span>              
            </div>
            <div className="flex-1 flex-col w-1/3 text-center">
              <h1 className="font-medium text-md">{macro.rmr}</h1>
              <span className="text-xs font-light text-foreground/50">RMR</span>              
            </div>
          </div> */}
          
        </CardContent>
      </Card>
    </div>
  )
}

export default CardMacro