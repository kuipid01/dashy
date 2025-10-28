// "use client";
// import { Poiret_One } from "next/font/google";
// import "../globals.css";
// import { ChevronDown, Copyright, Globe } from "lucide-react";
// import { usePathname, useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { ReactQueryProviders } from "../(handlers)/provicder";
// import { Toaster } from "sonner";
// import { useEffect } from "react";
// import { useFetchUser } from "../(handlers)/auth-handlers/auth";

// const poiretOne = Poiret_One({
//   variable: "--font-poiret-one",
//   subsets: ["latin"],
//   weight: ["400"]
// });

// //  const metadata: Metadata = {
// //   title: "Join Hubsell | Auth",
// //   description: "Hubsell Auth Pages"
// // };
// export default function RootLayout({
//   children
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { user, isLoading } = useFetchUser();
//   const isLoginPage = pathname.includes("login");

//   // Redirect logged-in users away from auth pages
//   useEffect(() => {
//     if (!isLoading && user) {
//       router.push("/dashboard");
//     }
//   }, [user, isLoading, router]);

//   // Show loading state while checking authentication
//   if (isLoading) {
//     return (
//       <html lang="en">
//         <body
//           className={`h-screen bg-white flex ${poiretOne.variable} antialiased`}
//         >
//           <div className="flex items-center justify-center w-full h-full">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//           </div>
//         </body>
//       </html>
//     );
//   }

//   // Don't render auth content if user is logged in
//   if (user) {
//     return (
//       <html lang="en">
//         <body
//           className={`h-screen bg-white flex ${poiretOne.variable} antialiased`}
//         >
//           <div className="flex items-center justify-center w-full h-full">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//           </div>
//         </body>
//       </html>
//     );
//   }

//   return (
//     <html lang="en">
//       <Toaster richColors />
//       {isLoginPage ? (
//         <body
//           className={` h-screen bg-white flex ${poiretOne.variable}  antialiased`}
//         >
//           <div className=" flex flex-col h-screen bg-white p-3 w-full ">
//             <div className="flex justify-between items-center">
//               <div className=" rounded-md border-zinc-300 border items-center flex gap-5 p-1">
//                 {" "}
//                 <div className=" flex items-center text-xs gap-1">
//                   <Globe size={20} className=" text-zinc-300" /> ENGLISH
//                 </div>
//                 <ChevronDown size={20} className=" text-zinc-300" />
//               </div>
//               <div className=" flex items-center gap-4 text-zinc-500">
//                 Don&apos;t have an account?
//                 <Link
//                   href="/signup"
//                   className=" px-3 cursor-pointer text-sm text-zinc-500 font-medium hover:bg-zinc-100 py-1 rounded-md border border-zinc-400"
//                 >
//                   Sign Up
//                 </Link>
//               </div>
//             </div>

//             <div className="w-full my-10 rounded-3xl overflow-hidden  flex flex-1  ">
//               <div className=" w-full lg:w-[55%] bg-[#F7F7F8] ">
//                 {" "}
//                 <ReactQueryProviders> {children}</ReactQueryProviders>
//               </div>
//               <div className=" hidden  bg-[#ECCDBA] w-[45%] lg:flex  justify-center items-center flex-col  h-full relative">
//                 <Image
//                   alt="Login Placeholder Image"
//                   src="/assets/login.jpg"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             </div>
//           </div>
//         </body>
//       ) : (
//         <>
//           <body
//             className={` h-screen bg-[#DBEEF5] flex ${poiretOne.variable}  antialiased`}
//           >
//             <div className=" hidden   w-[45%] lg:flex  justify-center items-center flex-col  h-full relative">
//               <h1 className=" text-white text-3xl leading-[1.4] font-medium text-center">
//                 Sign up <br />
//                 and come on in
//               </h1>
//               <p className=" absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center text-sm text-zinc-900 gap-1">
//                 {" "}
//                 <Copyright size={15} /> Hubsell
//               </p>
//               <Image
//                 alt="Login Placeholder Image"
//                 src="/assets/signUp.jpg"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <div className=" w-full lg:w-[55%]">
//               {" "}
//               <ReactQueryProviders> {children}</ReactQueryProviders>
//             </div>
//           </body>
//         </>
//       )}
//     </html>
//   );
// }

"use client";

import { Poiret_One } from "next/font/google";
import "../globals.css";
import { ReactQueryProviders } from "../(handlers)/provicder";
import { AuthLayout } from "./components/auth-layout";
import { Metadata } from "next";

const poiretOne = Poiret_One({
  variable: "--font-poiret-one",
  subsets: ["latin"],
  weight: ["400"]
});

export const metadata: Metadata = {
  title: "Hubsell Auth",
  description: "Hubsell Auth ❤",
  keywords: "Hubsell, auth",
  openGraph: {
    title: "Hubsell Auth",
    description: "Hubsell Auth ❤",
    url: "https://www.hubsell.com",
    siteName: "Hubsell",
    type: "website"
  }
};
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`h-screen bg-white flex ${poiretOne.variable} antialiased`}
      >
        <ReactQueryProviders>
          <AuthLayout>{children}</AuthLayout>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
