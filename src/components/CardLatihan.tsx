"use client"
import { rekomendasiOlahragaSchema } from '@/types/schemaResponseAi'
import React, { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog'
import { Card, CardAction, CardContent, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { Calendar, ChevronDown, ChevronRight, ChevronUp, Clock, Dumbbell, Filter, Loader2, RefreshCcw } from 'lucide-react'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'
import { getRekomendasiOlahraga } from '@/action/getRekomendasiOlahraga'
import LoadingOverlay from './loadingOverlay'
import { toast } from 'sonner'

type MenuLatihan = {
    nama: string;
    set: number;
    repetisi: string;
}

// ✅ Ubah props untuk menerima array langsung
const CardLatihan = (prop: { Dlatihan: any | null }) => {
    const [revealedLatihan, setRevealedLatihan] = useState<{[key: number]: boolean}>({})
    const [showAlert, setShowAlert] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const ArrayLatihan = [
        prop.Dlatihan[0],
        prop.Dlatihan[1],
        prop.Dlatihan[2],
        prop.Dlatihan[3],
        prop.Dlatihan[4],
        prop.Dlatihan[5],
        prop.Dlatihan[6],
    ]
    // ✅ State sudah langsung array
    const [initialLatihan, setInitialLatihan] = useState<rekomendasiOlahragaSchema | null>(ArrayLatihan)
    // console.log(initialLatihan)
    const [selectedKategori, setSelectedKategori] = useState<string[]>([])
    const [selectedHari, setSelectedHari] = useState<string[]>([])

    const toggleMenu = (index: number) => {
        setRevealedLatihan(prev => ({ ...prev, [index]: !prev[index] }))
    }

    const HARI_OPTIONS = [
        { value: "senin", label: "Senin" },
        { value: "selasa", label: "Selasa" },
        { value: "rabu", label: "Rabu" },
        { value: "kamis", label: "Kamis" },
        { value: "jumat", label: "Jumat" },
        { value: "sabtu", label: "Sabtu" },
        { value: "minggu", label: "Minggu" }
    ];

    const KATEGORI_OPTIONS = [
        { value: "kardio", label: "Kardio", icon: "🏃" },
        { value: "gym", label: "Gym", icon: "💪" },
        { value: "calisthenics", label: "Calisthenics", icon: "🤸" }
    ];

     const handleKategoriChange = (kategori: string) => {
        setSelectedKategori(prev => 
            prev.includes(kategori) 
                ? prev.filter(k => k !== kategori)
                : [...prev, kategori]
        )
    }

    const handleHariChange = (hari: string) => {
        setSelectedHari(prev => 
            prev.includes(hari) 
                ? prev.filter(h => h !== hari)
                : [...prev, hari]
        )
    }

    const handleMintaRekomendasi = async () => {
        setShowAlert(false)
        setIsLoading(true)
        const response = await getRekomendasiOlahraga({hariLatihanDalamSeminggu: selectedHari, kategoriLatihan: selectedKategori})
        if(!response.success || !response.data){
            toast(response.msg)
            return
        }
        setInitialLatihan(response.data)
        setIsLoading(false)
    }

    const isFormValid = selectedKategori.length > 0 && selectedHari.length > 0;
    
    // ✅ initialLatihan sudah array, tinggal cek aja
    const jadwalLatihan = initialLatihan || [];
    
    return (
        <>
            {isLoading && <LoadingOverlay />}
            {/* Alert Dialog */}
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Minta Rekomendasi Baru?</AlertDialogTitle>
                    <AlertDialogDescription>
                    Rekomendasi latihan sebelumnya akan diganti dengan yang baru. 
                    Proses ini memerlukan waktu beberapa detik. Apakah Anda yakin ingin melanjutkan?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleMintaRekomendasi}>Continue</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Main Card */}
            <Card className="flex-1/4 max-w-screen min-h-80">
                <>
                    <CardHeader>
                        <div className="flex items-center gap-2 text-2xl font-bold">
                            <Filter className="w-6 h-6 text-cyan-400" />
                            Pengaturan Latihan
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Kategori Selection */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold flex items-center gap-2">
                                <Dumbbell className="w-4 h-4 text-lime-400" />
                                Pilih Kategori Latihan (bisa lebih dari 1)
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {KATEGORI_OPTIONS.map(kategori => (
                                    <div 
                                        key={kategori.value}
                                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-accent ${
                                            selectedKategori.includes(kategori.value) 
                                                ? 'border-primary bg-primary/5' 
                                                : 'border-border'
                                        }`}
                                        onClick={() => handleKategoriChange(kategori.value)}
                                    >
                                        <Checkbox 
                                            id={`kategori-${kategori.value}`}
                                            checked={selectedKategori.includes(kategori.value)}
                                            onCheckedChange={() => handleKategoriChange(kategori.value)}
                                        />
                                        <Label 
                                            htmlFor={`kategori-${kategori.value}`}
                                            className="flex items-center gap-2 cursor-pointer flex-1"
                                        >
                                            <span className="text-2xl">{kategori.icon}</span>
                                            <span className="font-medium">{kategori.label}</span>
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hari Selection */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-violet-700" />
                                Pilih Hari Latihan
                            </Label>
                            <div className="grid grid-cols-3 md:grid-cols-7 lg:grid-cols-7 gap-2">
                                {HARI_OPTIONS.map(hari => (
                                    <div 
                                        key={hari.value}
                                        className={`flex w-22 lg:w-32 md:w-24 items-center space-x-1 lg:space-x-4 md:space-x-2 p-2 rounded-lg border-2 transition-all cursor-pointer hover:bg-accent ${
                                            selectedHari.includes(hari.value) 
                                                ? 'border-primary bg-primary/5' 
                                                : 'border-border'
                                        }`}
                                        onClick={() => handleHariChange(hari.value)}
                                    >
                                        <Checkbox 
                                            id={`hari-${hari.value}`}
                                            checked={selectedHari.includes(hari.value)}
                                            onCheckedChange={() => handleHariChange(hari.value)}
                                        />
                                        <Label 
                                            htmlFor={`hari-${hari.value}`}
                                            className="cursor-pointer font-medium flex-1 text-sm"
                                        >
                                            {hari.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <Button 
                                onClick={() => setShowAlert(true)} 
                                disabled={isLoading || !isFormValid}
                                className="w-full h-12 text-base bg-cyan-400"
                                size="lg"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" />
                                        Sedang Memproses...
                                    </>
                                ) : (
                                    <>
                                        <Dumbbell className="mr-2 " />
                                        Minta Rekomendasi Latihan
                                    </>
                                )}
                            </Button>
                            {!isFormValid && (
                                <p className="text-sm text-muted-foreground mt-2 text-center">
                                    Pilih minimal 1 kategori dan 1 hari untuk melanjutkan
                                </p>
                            )}
                        </div>

                        {/* Summary */}
                        {(selectedKategori.length > 0 || selectedHari.length > 0) && (
                            <div className="p-4 bg-muted rounded-lg space-y-2">
                                <p className="text-sm font-semibold">Ringkasan Pilihan:</p>
                                {selectedKategori.length > 0 && (
                                    <p className="text-sm">
                                        <span className="font-medium">Kategori:</span> {selectedKategori.join(', ')}
                                    </p>
                                )}
                                {selectedHari.length > 0 && (
                                    <p className="text-sm">
                                        <span className="font-medium">Hari:</span> {selectedHari.length} hari ({selectedHari.join(', ')})
                                    </p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </>
            </Card>

            {/* Card Latihan - ✅ Langsung cek array */}
            {Array.isArray(jadwalLatihan) && jadwalLatihan.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jadwalLatihan.map((data, index) => (
                        <Card key={index} className="flex flex-col hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold capitalize">{data.hari}</h3>
                                    <span className="px-3 py-1 text-black rounded-full text-sm font-medium capitalize bg-lime-400">
                                        {data.kategori}
                                    </span>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                                    <Clock className="w-4 h-4 " />
                                    <span className="font-semibold text-violet-700">{data.durasi}</span>
                                    <span>menit</span>
                                </div>
                                
                                <div className="mb-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground flex-1">
                                    {data.catatan}
                                </div>
                                
                                <Button 
                                    onClick={() => toggleMenu(index)} 
                                    variant="outline"
                                    className="w-full text-cyan-400"
                                >
                                    {revealedLatihan[index] ? (
                                        <>
                                            <ChevronUp className="mr-2 h-4 w-4" />
                                            Sembunyikan Detail
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="mr-2 h-4 w-4" />
                                            Lihat Detail
                                        </>
                                    )}
                                </Button>

                                {revealedLatihan[index] && (
                                    <div className="mt-4 space-y-3 animate-in fade-in-50 duration-300">
                                        <div className="flex items-center gap-2 text-lg font-bold mb-3">
                                            <Dumbbell className="w-5 h-5" />
                                            <span>Detail Latihan</span>
                                        </div>
                                        
                                        {data.detailLatihan && Array.isArray(data.detailLatihan) && data.detailLatihan.length > 0 ? (
                                            data.detailLatihan.map((detail: MenuLatihan, idx: number) => (
                                                <div 
                                                    key={idx} 
                                                    className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                                                >
                                                    <div className="font-medium mb-2">{detail.nama}</div>
                                                    <div className="flex gap-2 ">
                                                        <span className="text-sm px-3 py-2 bg-background/50 rounded-md font-medium text-lime-400">
                                                            {detail.set} set
                                                        </span>
                                                        <span className="text-sm px-3 py-2 bg-background/50 rounded-md font-medium text-lime-400">
                                                            {detail.repetisi}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">
                                                Tidak ada detail latihan tersedia
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="w-full">
                    <CardContent className="py-12 text-center">
                        <Dumbbell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium text-muted-foreground">
                            Belum ada rekomendasi latihan
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Pilih kategori dan hari latihan, lalu klik tombol di atas untuk mendapatkan rekomendasi
                        </p>
                    </CardContent>
                </Card>
            )}
        </>
    )
}

export default CardLatihan