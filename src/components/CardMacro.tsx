import { ChartRadarDefault } from "@/components/ChartsMakro";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { schemaMakronutrisi } from "@/types/schemaResponseAi";

const CardMacro = async(macro:schemaMakronutrisi) => {
  if (!macro) return (
    <div className="px-4 py-8 w-full min-h-screen flex justify-center items-center">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Kalori & Makronutrisi</CardTitle>
          <CardDescription>Kebutuhan Kalori Dan Makronutrisi Harian</CardDescription>
        </CardHeader>
        <CardContent>
            <p>No data available</p>
        </CardContent>
        </Card>
    </div>
  )
  return (
    <div className="px-4 py-8 w-full min-h-screen flex justify-center items-center">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Kalori & Makronutrisi</CardTitle>
          <CardDescription>Kebutuhan Kalori Dan Makronutrisi Harian</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartRadarDefault protein={macro.protein} lemak={macro.lemak} karbohidrat={macro.karbohidrat} />
          <div className="w-full h-full flex gap-1 my-4">
            <div className="flex-1 flex-col w-1/3 text-center">
              <h1 className="font-medium text-md">{macro.protein} gr</h1>
              <span className="text-xs font-light text-foreground/50">Protein</span>              
            </div>
            <div className="flex-1 flex-col w-1/3 text-center">
              <h1 className="font-medium text-md">{macro.lemak} gr</h1>
              <span className="text-xs font-light text-foreground/50">Lemak</span>              
            </div>
            <div className="flex-1 flex-col w-1/3 text-center">
              <h1 className="font-medium text-md">{macro.karbohidrat} gr</h1>
              <span className="text-xs font-light text-foreground/50">Karbohidrat</span>              
            </div>
          </div>
          <div className="w-full h-full flex gap-1 my-4">
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
          </div>
          
        </CardContent>
      </Card>
    </div>
  )
}

export default CardMacro