import { getDetailLatihan } from '@/action/supabaseFunc';
import { auth } from '@/auth';
import CardLatihan from '@/components/CardLatihan';
import React from 'react'
import { redirect } from 'next/navigation';

const page = async() => {
  const session = await auth()
  
  if(!session){
    redirect("/login")
  }
  const userId = session.user.id;

  const res = await getDetailLatihan(userId)
  
  return (
    <div className='w-full h-full flex justify-between px-8 py-4 flex-wrap gap-4'>
      {/* ✅ PERBAIKAN: Cast props to any to match component's prop type or update CardLatihan's props interface */}
      <CardLatihan Dlatihan={res.data ?? null} />
    </div>
  )
}

export default page