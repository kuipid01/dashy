import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
// import { Navbar } from "@/app/components/navbar";
import FooterNew from "@/app/components/footer-new";
import { NavbarNew } from "@/app/components/navbar-new";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "300", "500", "600", "900", "800", "700"]
});

export const metadata: Metadata = {
  title: "Hubsell",
  description: "Hubsell ❤",
  keywords: "Hubsell, store",
  icons: {
    icon: "/vercel.svg"
  },
  openGraph: {
    title: "Hubsell",
    description: "Hubsell ❤",
    url: "https://www.hubsell.com",
    siteName: "Hubsell",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`  bg-primary ${inter.variable}  antialiased`}>
        {/* <Navbar /> */}

        <NavbarNew />
        {children}
        <FooterNew />
      </body>
    </html>
  );
}
