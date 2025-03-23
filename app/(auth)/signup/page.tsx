import { ChevronDown, Globe, Play, Twitter } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className=" flex flex-col bg-white h-full p-3 rounded-l-xl">
      <div className="flex justify-between items-center">
        <div className=" rounded-md border-zinc-300 border items-center flex gap-5 p-1">
          {" "}
          <div className=" flex items-center text-xs gap-1">
            <Globe size={20} className=" text-zinc-300" /> ENGLISH
          </div>
          <ChevronDown size={20} className=" text-zinc-300" />
        </div>
        <div className=" flex items-center gap-4 text-zinc-500">
          Already have an account?
          <Link
            href="/login"
            className=" px-3 text-sm text-zinc-500 font-medium hover:bg-zinc-100 py-1 rounded-md border border-zinc-400"
          >
            Log In
          </Link>
        </div>
      </div>
      <div className="flex justify-center items-center flex-1">
        <form
          className=" max-w-[70%]  lg:max-w-md mx-auto b flex flex-col items-center"
          action=""
        >
          <h1 className=" text-[20px] font-medium text-center uppercase text-black mb-5">
            HubSell
          </h1>

          <p className=" text-black mb-5 font-light text-2xl leading-[1.5] text-center">
            Get better data with conversational forms, surveys, quizzes & more.
          </p>

          <button className="w-[400px] mb-5 text-zinc-900 h-[40px] font-medium hover:bg-zinc-100 py-1 rounded-md border border-zinc-400 flex justify-center items-center gap-3">
            <Play /> Sign up with Google
          </button>
          <button className="w-[400px]  text-zinc-900 h-[40px] font-medium hover:bg-zinc-100 py-1 rounded-md border border-zinc-400 flex justify-center items-center gap-3">
            <Twitter /> Sign up with Twitter
          </button>
          <p className=" my-5">OR</p>
          <Link
            href="/signup/email"
            className="w-[400px]  text-white h-[40px] font-medium bg-secondary  py-1 rounded-md  flex justify-center items-center gap-3"
          >
            Sign up with email
          </Link>
        </form>
      </div>
    </div>
  );
}
