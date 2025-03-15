import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/navbar";
import Footer from "./components/footer";

const raleway = Raleway({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Dashy",
  description: "Dashy ❤"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${raleway.variable}  antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
