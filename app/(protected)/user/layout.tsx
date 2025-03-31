"use client";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const settingsList = [
    { link: "Personal Information", active: true },
    { link: "Billing", active: true },
    { link: "Security", active: true },
    // { link: "Integrations", active: false },
    // { link: "Modifications", active: false },
  ];
  const active = searchParams.get("tab") || "Personal Information";
  const handleTabChange = (tab: string) => {
    router.push(`?tab=${tab}`, {
      scroll: false,
    });
  };
  return (
    <html lang="en">
      <body
        className={`lg:px-15 overflow-x-hidden relative pt-[calc(40px+7vh)] lg:pt-[calc(40px+10vh)] flex flex-col gap-5  md:px-8 px-5  bg-[#F7F7F8] min-h-screen antialiased`}
      >
        <div className="flex md:flex-row flex-col ">
          <div className="w-fit max-w-full overflow-x-auto md:sticky md:top-[calc(40px+7vh)] md:bottom-0 md:h-[calc(100vh-(7vh+40px))] flex flex-row md:flex-col gap-4">
            {settingsList.map((link) => (
              <button
              key={link.link}
                onClick={() => handleTabChange(link.link)}
                className={cn(
                  "capitalize cursor-pointer text-nowrap px-10 py-3 rounded-[10px] border  font-medium",
                  active === link.link ? " bg-black text-white" : ""
                )}
              >
                {link.link}{" "}
              </button>
            ))}
          </div>
          <div className="flex flex-col flex-1"> {children}</div>
        </div>
      </body>
    </html>
  );
}
