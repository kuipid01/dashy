"use client";
import { ChevronDown, Globe } from "lucide-react";
import Link from "next/link";
import {BACKEND_URL} from '@/constants/backend-url'

export default function Page() {

    const handleGoogleLogin = () => {
      console.log("clicked")
      // Redirect to the backend to start the Google OAuth flow
      window.location.href = `${BACKEND_URL}/v1/api/users`;
    };
  
  
  return (
    <div className=" flex flex-col bg-white h-full p-3 lg:rounded-l-xl">
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

          <button
          type="button"
            // disabled={loading}
            onClick={ handleGoogleLogin}
            className="w-[400px] cursor-pointer disabled:opacity-25 mb-5 text-zinc-900 h-[40px] font-medium hover:bg-zinc-100 py-1 rounded-md border border-zinc-400 flex justify-center items-center gap-3"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M22.5984 12.2509C22.5984 11.4681 22.5281 10.7154 22.3977 9.99274H12V14.2632H17.9415C17.6856 15.6432 16.9078 16.8124 15.7385 17.5953V20.3653H19.3065C21.394 18.4434 22.5984 15.6131 22.5984 12.2509Z"
                fill="#4285F4"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 23.0398C14.9808 23.0398 17.4799 22.0513 19.3065 20.3652L15.7386 17.5951C14.75 18.2575 13.4854 18.6489 12 18.6489C9.12461 18.6489 6.69079 16.7069 5.82264 14.0974H2.13428V16.9578C3.95086 20.5659 7.68439 23.0398 12 23.0398Z"
                fill="#34A853"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.82258 14.0977C5.60178 13.4353 5.47632 12.7277 5.47632 12.0001C5.47632 11.2724 5.60178 10.5649 5.82258 9.90246V7.0421H2.13422C1.38651 8.5325 0.959961 10.2186 0.959961 12.0001C0.959961 13.7815 1.38651 15.4676 2.13422 16.958L5.82258 14.0977Z"
                fill="#FBBC05"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 5.35092C13.6209 5.35092 15.0762 5.90793 16.2203 7.0019L19.3868 3.83542C17.4749 2.05397 14.9758 0.960007 12 0.960007C7.68439 0.960007 3.95086 3.43397 2.13428 7.04204L5.82264 9.90241C6.69079 7.29295 9.12461 5.35092 12 5.35092Z"
                fill="#EA4335"
              ></path>
            </svg>
           Sign up with Google
          </button>
          <button className="w-[400px]  text-zinc-900 h-[40px] font-medium hover:bg-zinc-100 py-1 rounded-md border border-zinc-400 flex justify-center items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 50 50"
            >
              <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path>
            </svg>
            Sign up with Twitter
          </button>
          {/* <p className=" my-5">OR</p> */}
          {/* <Link
          
            href="/signup/email"
            className="w-[400px]  text-white h-[40px] font-medium bg-secondary  py-1 rounded-md  flex justify-center items-center gap-3"
          >
            Sign up with email
          </Link> */}
        </form>
      </div>
    </div>
  );
}
