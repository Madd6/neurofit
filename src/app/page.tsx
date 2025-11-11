import { auth } from "@/auth";
import FormPersonalizeData from "@/components/form/FormPersonalizeData";
import { SignOut } from "@/components/signin/SignOutBtn";
import { ToggleTheme } from "@/components/toggleTheme";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth()
  // console.log("session", session?.user.id);
  if (!session?.user) redirect('/login')
  return (
    <div>
      <pre>{session.user.id}</pre>
      <nav>navbar</nav>
      <SignOut />
      Kalkulator Kebutuhan Kalori/Gizi <br />
      Update personal info <br />
      Rekomendasi Menu Makanan Sehat <br />
      Rekomendasi Olahraga <br />
      <ToggleTheme />
      <FormPersonalizeData/>
    </div>
  );
}
