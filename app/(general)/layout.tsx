import type { Metadata } from "next";
import { Poiret_One } from "next/font/google";
import "../globals.css";
import { Navbar } from "../components/navbar";
import Footer from "../components/footer";

const poiretOne = Poiret_One({
  variable: "--font-poiret-one",
  subsets: ["latin"],
  weight: ["400"]
});

export const metadata: Metadata = {
  title: "Hubsell",
  description: "Hubsell ❤"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${poiretOne.variable}  antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
