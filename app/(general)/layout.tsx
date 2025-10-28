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
  title: "Hubsell Store",
  description: "Hubsell Store ❤",
  keywords: "Hubsell,  account confirmation, user onboarding",
  icons: {
    icon: "/vercel.svg"
  },
  openGraph: {
    title: "Hubsell Store",
    description: "Hubsell ❤",
    url: "https://www.hubsell.com",
    siteName: "Hubsell",
    type: "website"
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
        // style={{ fontFamily: "MilanesaSerif" }}
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
