import type { Metadata } from "next";
import { Poiret_One } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import { ReactQueryProviders } from "../(handlers)/provicder";

const poiretOne = Poiret_One({
  variable: "--font-poiret-one",
  subsets: ["latin"],
  weight: ["400"]
});

export const metadata: Metadata = {
  title: "Hubsell Verification Success | Account Confirmed",
  description:
    "Successfully verified your Hubsell account! Start exploring our features and services. Hubsell ❤",
  keywords:
    "Hubsell, verification success, account confirmation, user onboarding",
  openGraph: {
    title: "Hubsell Verification Success",
    description:
      "Your Hubsell account has been successfully verified. Welcome aboard! Hubsell ❤",
    url: "https://www.hubsell.com/verification-success",
    siteName: "Hubsell",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Hubsell Verification Success",
    description:
      "Account verification completed successfully. Get started with Hubsell today! ❤"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Toaster />

      <body className={` ${poiretOne.variable} antialiased`}>
        <ReactQueryProviders> {children}</ReactQueryProviders>
      </body>
    </html>
  );
}
