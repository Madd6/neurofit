import { getDetailLatihan } from '@/action/supabaseFunc';
import { auth } from '@/auth';
import { rekomendasiOlahragaSchema } from '@/types/schemaResponseAi';
import CardLatihan from '@/components/CardLatihan';
import React from 'react'
import { toast } from 'sonner';
import { OneShotToast } from '@/components/OneShootToast';

const page = async() => {
  const session = await auth()
  const userId = session?.user.id;
  
  if (!userId) {
    return <div>Please login first</div>
  }

  const res = await getDetailLatihan(userId)
  
  if(!res.success || !res.data){
      
      return(
            <div className="w-full min-h-screen flex flex-col justify-center items-center gap-2">
              {/* ini client component yang bakal panggil toast */}
              <OneShotToast message={res.msg || "Gagal mengambil Detail Latihan"} />
      
              <p className="text-sm text-red-400">
                Gagal memuat Detail Latihan. Coba lagi nanti.
              </p>
            </div>
          )
  }
  return (
    <div className='w-full h-full flex justify-between px-8 py-4 flex-wrap gap-4'>
      {/* ✅ PERBAIKAN: Cast props to any to match component's prop type or update CardLatihan's props interface */}
      <CardLatihan Dlatihan={res.data} />
    </div>
  )
}

export default page