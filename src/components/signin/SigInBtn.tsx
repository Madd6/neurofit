import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { handleSignIn } from "./action/actionAuth";

interface SignInProps {
  provider: "github" | "google";
}

export default function SignIn({ provider }: SignInProps) {
  return (
    <form
      action={async () => {
        await handleSignIn(provider);
      }}
      className="w-full"
    >
      <button
        type="submit"
        className="cursor-pointer w-full flex bg-white p-2 rounded-md text-black font-medium justify-center items-center"
      >
        {provider === "github" && <FaGithub />}
        {provider === "google" && <FcGoogle />}
        <span className="ml-2">
          Masuk Dengan {provider.charAt(0).toUpperCase() + provider.slice(1)}
        </span>
      </button>
    </form>
  );
}
