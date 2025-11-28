import { getPersonalData } from '@/action/supabaseFunc'
import { auth } from '@/auth'
import FormPersonalizeData from '@/components/form/FormPersonalizeData'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async() => {
  const session = await auth()
  if(!session){
    redirect('login')
  }
  const userId = session.user.id;
  const res = await getPersonalData(userId!) || null
  
  const personaldata = res.data
  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
      <FormPersonalizeData personaldata={personaldata?.[0] ?? null} />
    </div>
  )
}

export default page
