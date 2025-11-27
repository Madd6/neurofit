import { getDetailLatihan } from '@/action/supabaseFunc';
import { auth } from '@/auth';
import { rekomendasiOlahragaSchema } from '@/types/schemaResponseAi';
import CardLatihan from '@/components/CardLatihan';
import React from 'react'
import { toast } from 'sonner';

const page = async() => {
  const session = await auth()
  const userId = session?.user.id;
  
  if (!userId) {
    return <div>Please login first</div>
  }

  const res = await getDetailLatihan(userId)
  
  if(!res.success || !res.data){
      toast(res.msg)
      return
  }
  return (
    <div className='w-full h-full flex justify-between px-8 py-4 flex-wrap gap-4'>
      {/* ✅ PERBAIKAN: Cast props to any to match component's prop type or update CardLatihan's props interface */}
      <CardLatihan Dlatihan={res.data} />
    </div>
  )
}

export default page