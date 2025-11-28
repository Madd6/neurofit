"use client"
import { SchemaMenuMakanan } from '@/types/schemaResponseAi'
import React, { useState } from 'react'
import { Card, CardAction, CardContent, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { ChefHat, Flame, Scale, RefreshCcw, ChevronRight, ChevronDown, Salad, Loader2 } from 'lucide-react';
import { getRekomendasiMakanan } from '@/action/getRekomendasiMakanan'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from './ui/alert-dialog'
import { insertRekomendasiMakanan } from '@/action/supabaseFunc'
import LoadingOverlay from './loadingOverlay'
import { toast } from 'sonner'
import Link from 'next/link'


type Bahan = {
  daftarBahan: string,
  jumlahBahan: number
}

type CaraMemasak = {
  langkah: string,
  urutanLangkah: number
}
interface CardMenuMakananProps {
  menu?: SchemaMenuMakanan | null;
}


// Komponen Nutrisi Card
const NutrisiCard = ({ label, value, unit, className }: { label: string, value: number, unit: string ,className?:string}) => (
  <div className={`w-2/5 h-24 border-2 rounded-xl text-sm font-light px-4 flex flex-col justify-center items-start `}>
    {label}: <div className={`text-xl font-bold ${className}`}>{value}</div> {unit}
  </div>
)

// Komponen Rekomendasi Summary
const RekomendasiSummary = ({ menu, title, variant = "green" }: { 
  menu: SchemaMenuMakanan, 
  title: string,
  variant?: "green" | "red"
}) => {
  const color = variant === "green" ? "text-lime-400" : "text-violet-700"
  
  return (
    <Card className='bg-secondary max-h-80 h-[90%] w-[90%] md:w-[45%] rounded-xl overflow-y-auto'>
      <CardContent className='p-6'>
        <h1 className='text-2xl font-bold mb-4'>{title}</h1>
        
        {/* Total Nutrisi */}
        <div className="bg-background rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Flame className={`w-4 h-4 ${color}`} />
            Total Nutrisi Harian
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-secondary p-2 rounded">
              <div className="text-foreground/50 text-xs">Kalori</div>
              <div className={`${color} font-bold`}>{menu.totalHarian.kalori} kkal</div>
            </div>
            <div className="bg-secondary p-2 rounded">
              <div className="text-foreground/50 text-xs">Protein</div>
              <div className={`${color} font-bold`}>{menu.totalHarian.protein} g</div>
            </div>
            <div className="bg-secondary p-2 rounded">
              <div className="text-foreground/50 text-xs">Lemak</div>
              <div className={`${color} font-bold`}>{menu.totalHarian.lemak} g</div>
            </div>
            <div className="bg-secondary p-2 rounded">
              <div className="text-foreground/50 text-xs">Karbohidrat</div>
              <div className={`${color} font-bold`}>{menu.totalHarian.karbohidrat} g</div>
            </div>
          </div>
        </div>

        {/* Daftar Menu */}
        <div className="space-y-2 ">
          <h4 className="font-semibold text-sm mb-2">Daftar Menu:</h4>
          {menu.meals.map((meal, idx) => (
            <div key={idx} className="bg-background rounded-lg p-3 border border-gray-700">
              <div className="font-medium text-sm">{meal.nama}</div>
              <div className="text-xs text-foreground/50 mt-1">{meal.jamMakan}</div>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                <span className={`bg-secondary px-2 py-1 rounded ${color}`}>{meal.perkiraanKalori} kkal</span>
                <span className="bg-secondary px-2 py-1 rounded text-foreground/50">P:{meal.protein}g</span>
                <span className="bg-secondary px-2 py-1 rounded text-foreground/50">L:{meal.lemak}g</span>
                <span className="bg-secondary px-2 py-1 rounded text-foreground/50">K:{meal.karbohidrat}g</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Komponen Comparison Modal
const ComparisonModal = ({ 
  menuLama, 
  menuBaru, 
  onClose, 
  onConfirm 
}: { 
  menuLama: SchemaMenuMakanan, 
  menuBaru: SchemaMenuMakanan, 
  onClose: () => void,
  onConfirm: () => void
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4 ">
    <div className='w-full max-w-6xl h-[90vh] bg-background rounded-xl shadow-2xl flex flex-col '>
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">Perbandingan Rekomendasi</h2>
      </div>
      
      <div className='flex-1 flex flex-col md:flex-row gap-4 p-6 justify-center items-center overflow-y-auto'>
        <RekomendasiSummary menu={menuLama} title="Rekomendasi Lama" variant="red" />
        <RekomendasiSummary menu={menuBaru} title="Rekomendasi Baru" variant="green" />
      </div>

      <div className="p-6 border-t flex md:flex-row flex-col gap-3 justify-end">
        <Button variant="outline" onClick={onClose}>Tutup Perbandingan</Button>
        <Button onClick={onConfirm}>Gunakan Rekomendasi Baru</Button>
      </div>
    </div>
  </div>
)

// Main Component
const CardMenuMakanan = ({menu}:CardMenuMakananProps) => {
  const [revealedMenus, setRevealedMenus] = useState<{[key: number]: boolean}>({})
  const [revealedCatatan, setRevealedCatatan] = useState(false)
  const [revealedTotalNutrisi, setRevealedTotalNutrisi] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [menuBaru, setMenuBaru] = useState<SchemaMenuMakanan | null>(null)
  const [initialMenu, setInitialMenu] = useState<SchemaMenuMakanan | null>(menu?menu:null)
  
  const toggleMenu = (index: number) => {
    setRevealedMenus(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const requestNewRekomendasi = async () => {
  setShowAlert(false)
  setIsLoading(true)

  try {
    const res = await getRekomendasiMakanan()
    if(!res.success || !res.data){
        if(res.msg === "gagal mendapatkan personal data"){
          toast.error(() => (
            <div className="flex flex-col gap-2">
              <p>{res.msg}</p>
              <Link href={'/FormIsiDataDiri'}>
                <Button size={"sm"} className='bg-lime-400'>Isi Data Diri</Button>
              </Link>
            </div>
          ))
          return
        }
        toast.error(res.msg)
        return
    }
    if(res.msg === "success insert ke database"){
      setMenuBaru(res.data)
      return
    }
    toast.success(res.msg)

    setMenuBaru(res.data)
    setShowComparison(true)
  } catch (error) {
    console.error("Error fetching new menu:", error)
  } finally {
    setIsLoading(false)
  }
}


  const handleConfirmNewMenu = async() => {
    setShowComparison(false)
    const response = await insertRekomendasiMakanan(menuBaru!)
    if(!response.success || !response.data){
        toast.error(response.msg)
        return
    }
    toast.success(response.msg)
    setInitialMenu(response.data)
    // window.location.reload() // atau update state menu
  }

  return (
    <>
      {/* Alert Dialog */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Minta Rekomendasi Baru?</AlertDialogTitle>
            <AlertDialogDescription>
              Rekomendasi makanan sebelumnya akan diganti dengan yang baru. 
              Proses ini memerlukan waktu beberapa detik. Apakah Anda yakin ingin melanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={requestNewRekomendasi}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Card */}
      <Card className="w-screen min-h-80">
        {menu === null ? (
          <div className="w-full h-full flex justify-center items-center p-6">
            <Button onClick={() => setShowAlert(true)} disabled={isLoading} className='bg-lime-400'>
              {isLoading ? <Loader2 className="animate-spin" /> : <Salad />}
              {isLoading ? "Loading..." : "Minta Rekomendasi"}
            </Button>
          </div>
        ) : (
          <>
            <CardHeader>
              <div className="rounded-t-2xl flex items-start text-2xl font-bold flex-col ">
                Rekomendasi Makanan
              </div>
              <CardAction>
                <Button onClick={() => setShowAlert(true)} disabled={isLoading} className='bg-cyan-400'>
                  {isLoading ? <Loader2 className="animate-spin" /> : <RefreshCcw />}
                  {isLoading ? "Loading..." : "Minta Lagi"}
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent>
              {/* Catatan */}
              <div className="flex gap-4 cursor-pointer my-2 items-center" onClick={() => setRevealedCatatan(!revealedCatatan)}>
                <span>Lihat Catatan</span>
                {revealedCatatan ? <ChevronDown /> : <ChevronRight />}
              </div>
              {revealedCatatan && <div className="mb-4">{initialMenu?.catatan}</div>}

              {/* Total Nutrisi */}
              <div className="flex gap-4 cursor-pointer my-2 items-center" onClick={() => setRevealedTotalNutrisi(!revealedTotalNutrisi)}>
                <span>Lihat total nutrisi harian</span>
                {revealedTotalNutrisi ? <ChevronDown /> : <ChevronRight />}
              </div>
              {revealedTotalNutrisi && (
                <div>
                  <h1 className="text-lg font-bold my-4 flex items-center gap-2">
                    <Flame className='text-violet-700'/> Total Nutrisi Harian:
                  </h1>
                  <div className="w-full flex flex-wrap justify-center items-center gap-4">
                    <NutrisiCard className='text-cyan-400' label="Kalori" value={initialMenu?.totalHarian.kalori ?? 0} unit="kkal" />
                    <NutrisiCard className='text-cyan-300' label="Protein" value={initialMenu?.totalHarian.protein ?? 0} unit="gram" />
                    <NutrisiCard className='text-purple-400' label="Lemak" value={initialMenu?.totalHarian.lemak ?? 0} unit="gram" />
                    <NutrisiCard className='text-lime-400' label="Karbohidrat" value={initialMenu?.totalHarian.karbohidrat ?? 0} unit="gram" />
                  </div>
                </div>
              )}
            </CardContent>
          </>
        )}
      </Card>

      {/* Meal Cards */}
      {initialMenu !== null && initialMenu.meals.map((
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        meal: any, index: number
      ) => (
        <Card key={index} className="md:flex-1/4 flex-1 max-w-screen min-h-80">
          <CardHeader>
            <div className='text-2xl font-bold'>{meal.nama}</div>
          </CardHeader>
          <CardContent>
            <div className="mb-2">jam makan: <span className='text-violet-700'>{meal.jamMakan}</span></div>
            <div className='min-h-24 mb-4 '>{meal.deskripsi}</div>
            
            <Button onClick={() => toggleMenu(index)} className="mb-4 bg-lime-400">
              {revealedMenus[index] ? 'Sembunyikan Detail' : 'Lihat Detail'}
            </Button>

            {revealedMenus[index] && (
              <div className="space-y-6">
                {/* Bahan-bahan */}
                <div>
                  <h1 className='text-lg font-bold mb-4 flex items-center gap-2'>
                    <Scale className='text-cyan-400' /> Bahan-bahan:
                  </h1>
                  {meal.bahan.map((bahan: Bahan, idx: number) => (
                    <div key={idx} className="flex justify-between items-center rounded-lg bg-secondary h-12 px-4 my-2"> 
                      <span className='text-foreground/70'>{bahan.daftarBahan}</span>  
                      <span className="font-medium text-cyan-300">{bahan.jumlahBahan}</span>
                    </div>
                  ))}
                </div>

                {/* Cara Memasak */}
                <div>
                  <h1 className='text-lg font-bold my-4 flex items-center gap-2'>
                    <ChefHat className='text-lime-400'/> Cara Memasak:
                  </h1>
                  {meal.caraMemasak.map((step: CaraMemasak, idx: number) => (
                    <div key={idx} className="flex gap-3 items-start rounded-lg bg-secondary min-h-12 py-2 px-4 my-2"> 
                      <span className="w-6 h-6 flex-shrink-0 bg-lime-400 text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                        {step.urutanLangkah}
                      </span>
                      <span className="flex-1">{step.langkah}</span>  
                    </div>
                  ))}
                </div>

                {/* Nutrisi */}
                <div>
                  <h1 className='text-lg font-bold my-4 flex items-center gap-2'>
                    <Flame className='text-violet-600' /> Nutrisi:
                  </h1>
                  <div className='w-full flex flex-wrap justify-center items-center gap-4'>
                    <NutrisiCard className='text-cyan-400' label="Kalori" value={meal.perkiraanKalori} unit="kkal" />
                    <NutrisiCard className='text-cyan-300' label="Protein" value={meal.protein} unit="gram" />
                    <NutrisiCard className='text-purple-400' label="Lemak" value={meal.lemak} unit="gram" />
                    <NutrisiCard className='text-lime-400' label="Karbohidrat" value={meal.karbohidrat} unit="gram" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay />}

      {/* Comparison Modal */}
      {showComparison && menuBaru && menu && (
        <ComparisonModal 
          menuLama={menu} 
          menuBaru={menuBaru} 
          onClose={() => setShowComparison(false)}
          onConfirm={handleConfirmNewMenu}
        />
      )}
    </>
  )
}

export default CardMenuMakanan