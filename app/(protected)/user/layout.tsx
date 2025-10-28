import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import SettingsSidebar from "./pages/_comps/settings-sidebar";

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex  lg:flex-row flex-col overflow-x-hidden relative min-h-screen antialiased">
      <Suspense
        fallback={
          <div className="grid place-items-center py-10">
            <Loader2 className="animate-spin duration-300" />
          </div>
        }
      >
        <SettingsSidebar />
      </Suspense>
      <div className="flex mt-5 sm:mt-0 flex-col px-0 sm:px-5 lg:px-10  flex-1">
        {children}
      </div>
    </div>
  );
}
