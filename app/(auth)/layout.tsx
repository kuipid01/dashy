import { Poiret_One } from "next/font/google";
import "../globals.css";
import { Copyright } from "lucide-react";

const poiretOne = Poiret_One({
  variable: "--font-poiret-one",
  subsets: ["latin"],
  weight: ["400"]
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` h-screen  bg-secondary flex ${poiretOne.variable}  antialiased`}
      >
        <div className=" hidden  bg-secondary w-[45%] lg:flex  justify-center items-center flex-col  h-full relative">
          <h1 className=" text-white text-3xl leading-[1.4] font-medium text-center">
            Sign up <br />
            and come on in
          </h1>
          <p className=" absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center text-sm text-zinc-900 gap-1">
            {" "}
            <Copyright size={15} /> Hubsell
          </p>
        </div>
        <div className=" w-full lg:w-[55%]">{children}</div>
      </body>
    </html>
  );
}
