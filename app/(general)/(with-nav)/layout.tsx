import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import { Navbar } from "@/app/components/navbar";
import Footer from "@/app/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "300", "500", "600", "900", "800", "700"]
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
      <body className={`  bg-primary ${inter.variable}  antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
