import { getMenuMakanan } from "@/action/supabaseFunc";
import { auth } from "@/auth";
import CardMenuMakanan from "@/components/CardMenuMakanan";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const page = async() => {
  const session = await auth()
  const userId = session?.user.id;
  const menu = await getMenuMakanan(userId!)
  // if (!menu) throw new Error('Menu Makanan not found');
  // console.log("menu", menu[0].menuMakanan);
  return (
    <div className='w-full h-full flex justify-between px-8 py-4 flex-wrap gap-4'>
      <CardMenuMakanan {...(menu ? menu[0].menuMakanan : null)}/>
    </div>
  )
}

export default page
