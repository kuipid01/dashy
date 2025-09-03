import type { Metadata } from "next";
// import { Poiret_One } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner"; // Corrected typo
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getDiscoveryContent } from "../(handlers)/content/api";
import { ReactQueryProviders } from "../(handlers)/provicder";

// const poiretOne = Poiret_One({
//   variable: "--font-poiret-one",
//   subsets: ["latin"],
//   weight: ["400"],
// });

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

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["discovery-contents"],
    queryFn: getDiscoveryContent
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="en">
      <body
        style={{ fontFamily: "MilanesaSerif" }}
        className={`antialiased bg-primary`}
      >
        <Toaster />
        <ReactQueryProviders initialState={dehydratedState}>
          {children}
        </ReactQueryProviders>
      </body>
    </html>
  );
}
