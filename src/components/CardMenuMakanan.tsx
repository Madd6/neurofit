"use client"
import { SchemaMenuMakanan } from '@/types/schemaResponseAi'
import React, { useState } from 'react'
import { Card, CardAction, CardContent, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { ChefHat, Flame, Scale, RefreshCcw, ChevronRight, ChevronDown, Salad, CircleFadingArrowUpIcon  } from 'lucide-react';
import { getRekomendasiMakanan } from '@/action/getRekomendasiMakanan'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'

type Bahan = {
  daftarBahan:string,
  jumlahBahan:number
}
type caramemasak = {
  langkah:string,
  urutanLangkah:number
}

const CardMenuMakanan = (menu:SchemaMenuMakanan | null) => {
    // Gunakan object untuk tracking state tiap menu berdasarkan index
    const [revealedMenus, setRevealedMenus] = useState<{[key: number]: boolean}>({})
    const [revealedCatatan, setRevealedCatatan] = useState<boolean>(false)
    const [revealedTotalNutrisi, setRevealedTotalNutrisi] = useState<boolean>(false)
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [showComparasion, setShowComparasion] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [menuBaru, setMenuBaru] = useState<SchemaMenuMakanan|null>(null)
    
    const toggleMenu = (index: number) => {
      setRevealedMenus(prev => ({
        ...prev,
        [index]: !prev[index] // Toggle state untuk menu spesifik
      }))
    }
    const toggleCatatan = () => {
      setRevealedCatatan(prev => !prev)
    }
    const toggleTotalNutrisi = () => {
      setRevealedTotalNutrisi(prev => !prev)
    }
    const showAllert = () => {
        setShowAlert(prev => !prev)
    }

    const toggleShowComparasion = () => {
        setShowComparasion(showComparasion)
    }

    const requestNewRekomendasi = async () => {
        try {
            setShowAlert(false)
            setIsLoading(true);
            const newMenu = await getRekomendasiMakanan();
            setMenuBaru(newMenu)
            toggleShowComparasion()
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching new menu:", error);
        }
    }

  return (
    <>
        <AlertDialog open={showAlert}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Minta Rekomendasi Baru?</AlertDialogTitle>
                <AlertDialogDescription>
                    Rekomendasi makanan sebelumnya akan diganti dengan yang baru. 
                    Proses ini memerlukan waktu beberapa detik. Apakah Anda yakin ingin melanjutkan?
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowAlert(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={requestNewRekomendasi}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        <Card className="flex-1/4 max-w-screen min-h-80">
            {menu === null ? (
                <div className="w-full h-full flex justify-center items-center">
                <Button onClick={showAllert}>
                    <Salad /> {isLoading?"Loading..":"Minta Rekomendasi"}
                </Button>
                </div>
            ) : (
                <>
                <CardHeader>
                    <div className="rounded-t-2xl flex items-end text-2xl font-bold">
                    Rekomendasi Makanan
                    </div>

                    <CardAction>
                    <Button onClick={showAllert}>
                        <RefreshCcw /> {isLoading?"Loading..":"Minta Rekomendasi"}
                    </Button>
                    </CardAction>
                </CardHeader>

                <CardContent>
                    {/* CATATAN */}
                    <div
                    className="flex gap-4 cursor-pointer my-2"
                    onClick={toggleCatatan}
                    >
                    Lihat Catatan
                    {revealedCatatan ? <ChevronDown /> : <ChevronRight />}
                    </div>

                    {revealedCatatan && <div>{menu.catatan}</div>}

                    {/* TOTAL NUTRISI */}
                    <div
                    className="flex gap-4 cursor-pointer my-2"
                    onClick={toggleTotalNutrisi}
                    >
                    Lihat total nutrisi total
                    {revealedTotalNutrisi ? <ChevronDown /> : <ChevronRight />}
                    </div>

                    {revealedTotalNutrisi && (
                    <div>
                        <h1 className="text-lg font-bold my-4 flex items-center gap-2">
                        <Flame /> Total Nutrisi Harian:
                        </h1>

                        <div className="w-full flex flex-wrap justify-center items-center gap-4">
                        <div className="w-2/5 h-24 border-2 rounded-xl text-sm font-light px-4 flex flex-col justify-center items-start">
                            Kalori:
                            <div className="text-xl font-bold">{menu.totalHarian.kalori}</div>
                            kkal
                        </div>

                        <div className="w-2/5 h-24 border-2 rounded-xl text-sm font-light px-4 flex flex-col justify-center items-start">
                            Protein:
                            <div className="text-xl font-bold">{menu.totalHarian.protein}</div>
                            gram
                        </div>

                        <div className="w-2/5 h-24 border-2 rounded-xl text-sm font-light px-4 flex flex-col justify-center items-start">
                            Lemak:
                            <div className="text-xl font-bold">{menu.totalHarian.lemak}</div>
                            gram
                        </div>

                        <div className="w-2/5 h-24 border-2 rounded-xl text-sm font-light px-4 flex flex-col justify-center items-start">
                            Karbohidrat:
                            <div className="text-xl font-bold">{menu.totalHarian.karbohidrat}</div>
                            gram
                        </div>
                        </div>
                    </div>
                    )}
                </CardContent>
                </>
            )}
            </Card>

      {menu!==null&&menu.meals.map((meal: any, index: number) => (
        <Card key={index} className="flex-1/4 max-w-screen min-h-80">
          <CardHeader className=' '>
            <div className='rounded-t-2xl  flex items-end text-2xl font-bold'>{meal.nama}</div>
          </CardHeader>
          <CardContent>
            <div>jam makan : {meal.jamMakan}</div>
            <br></br>
            <div className='min-h-24'>{meal.deskripsi}</div>
            <Button onClick={() => toggleMenu(index)}>
              {revealedMenus[index] ? 'Sembunyikan Detail' : 'Lihat Detail'}
            </Button>
            {revealedMenus[index] && (
                    <div>
                        <h1 className='text-lg font-bold mb-4 flex items-center gap-2'><Scale/> Bahan-bahan : </h1>
                        {meal.bahan.map((bahan: Bahan, idx: number) => (
                            <div key={idx} className="text-sm font-medium  flex justify-between items-center rounded-lg bg-secondary h-12 px-4 my-2"> 
                                <span className="flex-2/3">{bahan.daftarBahan}</span>  
                                <span className="flex-1/3 text-end">{bahan.jumlahBahan}</span>
                            </div>
                        ))}
                        <h1 className='text-lg font-bold my-4 flex items-center gap-2'><ChefHat/> Cara Memasak :</h1>
                        {meal.caraMemasak.map((caramemasak: caramemasak, idx: number) => (
                            <div key={idx} className="text-sm font-medium  flex justify-between items-center rounded-lg bg-secondary min-h-12 py-2 px-4 my-2"> 
                                <span className="w-8 start">{caramemasak.urutanLangkah}</span>
                                <span className="flex-2/3">{caramemasak.langkah}</span>  
                            </div>
                        ))}
                        <h1 className='text-lg font-bold my-4 flex items-center gap-2'><Flame/> Nutrisi:</h1>
                        <div className='w-full flex flex-wrap justify-center items-center gap-4'>
                            <div className='w-2/5 h-24 border-2 rounded-xl text-sm font-light px-4 flex flex-col justify-center items-start '>
                                Kalori: <div className='text-xl font-bold'>{meal.perkiraanKalori}</div> kkal
                            </div>
                            <div className='w-2/5 h-24 border-2 rounded-xl text-sm font-light px-4 flex flex-col justify-center items-start '>
                                Protein: <div className='text-xl font-bold'>{meal.protein}</div> gram
                            </div>
                            <div className='w-2/5 h-24 border-2 rounded-xl text-sm font-light px-4 flex flex-col justify-center items-start '>
                                Lemak: <div className='text-xl font-bold'>{meal.lemak}</div> gram
                            </div>
                            <div className='w-2/5 h-24 border-2 rounded-xl text-sm font-light px-4 flex flex-col justify-center items-start '>
                                Karbohidrat: <div className='text-xl font-bold'>{meal.karbohidrat}</div> gram
                            </div>
                            
                        </div>
                    </div>
                )
            }
          </CardContent>
        </Card>
      ))}
      {isLoading&&(
        <div className="flex-col gap-4 flex items-center justify-center fixed top-1/2 left-1/2 -translate-1/2">
            <div className='w-80 max-w-screen h-80 max-h-screen bg-background/80 rounded-xl flex flex-col gap-8 justify-center items-center shadow-2xl backdrop-blur-sm'> 
                <div className='text-xl font-bold'>Tunggu Sebentar...</div>
                <div
                    className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
                >
                    <div
                    className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
                    ></div>
                </div>
            </div>
        </div>
      )}
      {menuBaru&&(
        <div className='flex-col gap-4 flex items-center justify-center fixed top-1/2 left-1/2 -translate-1/2'>
            
        </div>
      )}
    </>
  )
}

export default CardMenuMakanan