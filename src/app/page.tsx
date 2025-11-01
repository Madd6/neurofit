import { SignOut } from "@/components/signin/SignOutBtn";

export default function Home() {
  return (
    <div>
      <nav>navbar</nav>
      <SignOut />
      <main className="w-full min-h-screen flex justify-center items-center flex-wrap">
        <div className="w-2/3 h-80 bg-blue-300 rounded-xl shadow-lg">a</div>
        <div className="w-1/3 h-80 bg-blue-300 rounded-xl shadow-lg">b</div>
        
      </main>
    </div>
  );
}
