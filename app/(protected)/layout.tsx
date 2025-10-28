import "../globals.css";
import NavbarProtected from "../(protected)/_components/navbar-protected";
import { Toaster } from "sonner";
import { ReactQueryProviders } from "../(handlers)/provicder";
import { WebSocketProvider } from "@/components/websocket-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubsell Dashboard",
  description: "Hubsell Dashboard ❤",
  keywords: "Hubsell, dashboard",
  openGraph: {
    title: "Hubsell Dashboard",
    description: "Hubsell Dashboard ❤",
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
      <Toaster richColors />
      <body style={{ fontFamily: "MilanesaSerif" }}>
        <div
          className={`lg:px-15 pt-[calc(40px+7vh)] lg:pt-[calc(40px+10vh)] flex flex-col gap-5  md:px-8 px-5  bg-primary min-h-screen antialiased`}
        >
          <WebSocketProvider>
            <ReactQueryProviders>
              <NavbarProtected />

              {children}
            </ReactQueryProviders>
          </WebSocketProvider>
        </div>
      </body>
    </html>
  );
}
