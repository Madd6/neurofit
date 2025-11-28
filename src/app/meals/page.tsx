import { getMenuMakanan } from "@/action/supabaseFunc";
import { auth } from "@/auth";
import CardMenuMakanan from "@/components/CardMenuMakanan";
import { redirect } from "next/navigation";

const page = async() => {
  const session = await auth()
  const userId = session?.user.id;
  const res = await getMenuMakanan(userId!)
  if(!session){
    redirect("/login")
  }
  const menu = res.data
  return (
    <div className='w-full h-full flex justify-between px-8 py-4 flex-wrap gap-4'>
      <CardMenuMakanan menu={menu?.[0] ?? null} />
    </div>
  )
}

export default page
