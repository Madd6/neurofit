import { getRekomendasiMakanan } from "@/action/getRekomendasiMakanan";
import { getRekomendasiOlahraga } from "@/action/getRekomendasiOlahraga";
import { getMakronutrisi } from "@/action/supabaseFunc";
import tdeeCalculator from "@/action/tdeeCalculator";
import { auth } from "@/auth";
import CardMacro from "@/components/CardMacro";
import FormPersonalizeData from "@/components/form/FormPersonalizeData";
import { SignOut } from "@/components/signin/SignOutBtn";
import { ToggleTheme } from "@/components/toggleTheme";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth()
  const userId = session?.user.id;
  // console.log("session", session?.user.id);
  // const test= await getRekomendasiMakanan();
  const macro = await getMakronutrisi(userId!);
  if (!macro) throw new Error('Makronutrisi not found');
  if (!session?.user) redirect('/login')
  return (
    <div>
      <SignOut />
      <ToggleTheme />
      <CardMacro tdee={macro[0].tdee} rmr={macro[0].rmr} targetKalori={macro[0].targetKalori} protein={macro[0].protein} lemak={macro[0].lemak} karbohidrat={macro[0].karbohidrat}/>
    </div>
  );
}
