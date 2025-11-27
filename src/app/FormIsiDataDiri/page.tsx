import { getPersonalData } from '@/action/supabaseFunc'
import { auth } from '@/auth'
import FormPersonalizeData from '@/components/form/FormPersonalizeData'
import React from 'react'
import { toast } from 'sonner'

const page = async() => {
  const session = await auth()
  const userId = session?.user.id;
  const res = await getPersonalData(userId!) || null
  if(!res.success || !res.data){
      toast(res.msg)
      return
  }
  
  const personaldata = res.data
  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
      <FormPersonalizeData {...(personaldata?.[0] || {})} />
    </div>
  )
}

export default page
