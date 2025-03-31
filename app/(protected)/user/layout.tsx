"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import SettingsSidebar from "./pages/_comps/settings-sidebar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`lg:px-15 overflow-x-hidden relative pt-[calc(40px+7vh)] lg:pt-[calc(40px+10vh)] flex flex-col gap-5 md:px-8 px-5 bg-[#F7F7F8] min-h-screen antialiased`}
      >
        <div className="flex md:flex-row flex-col">
          <Suspense
            fallback={
              <div className="h-screen grid place-items-center">
                <Loader2 className="animate-spin duration-300" />
              </div>
            }
          >
            <SettingsSidebar />
          </Suspense>
          <div className="flex flex-col flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
