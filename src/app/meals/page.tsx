import { getMenuMakanan } from "@/action/supabaseFunc";
import { auth } from "@/auth";
import CardMenuMakanan from "@/components/CardMenuMakanan";
import { OneShotToast } from "@/components/OneShootToast";
import { toast } from "sonner";

const page = async() => {
  const session = await auth()
  const userId = session?.user.id;
  const res = await getMenuMakanan(userId!)
  if(!res.success || !res.data){
      
      return(
            <div className="w-full min-h-screen flex flex-col justify-center items-center gap-2">
              {/* ini client component yang bakal panggil toast */}
              <OneShotToast message={res.msg || "Gagal mengambil Menu Makanan"} />
      
              <p className="text-sm text-red-400">
                Gagal memuat Menu Makanan. Coba lagi nanti.
              </p>
            </div>
          )
  }

  const menu = res.data
  return (
    <div className='w-full h-full flex justify-between px-8 py-4 flex-wrap gap-4'>
      <CardMenuMakanan {...(menu ? menu[0].menuMakanan : null)}/>
    </div>
  )
}

export default page
