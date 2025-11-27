import { getPersonalData } from '@/action/supabaseFunc'
import { auth } from '@/auth'
import FormPersonalizeData from '@/components/form/FormPersonalizeData'
import { OneShotToast } from '@/components/OneShootToast'
import React from 'react'
import { toast } from 'sonner'

const page = async() => {
  const session = await auth()
  const userId = session?.user.id;
  const res = await getPersonalData(userId!) || null
  if(!res.success || !res.data){
      // toast(res.msg)
      return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center gap-2">
        {/* ini client component yang bakal panggil toast */}
        <OneShotToast message={res.msg || "Gagal mengambil data personal"} />

        <p className="text-sm text-red-400">
          Gagal memuat data personal. Coba lagi nanti.
        </p>
      </div>
    )
  }
  
  const personaldata = res.data
  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
      <FormPersonalizeData {...(personaldata?.[0] || {})} />
    </div>
  )
}

export default page
