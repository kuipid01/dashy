"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const settingsList = [
  { link: "Personal Information", active: true },
  { link: "Billing", active: true },
  { link: "Security", active: true },
  { link: "Integrations", active: true },
  { link: "Store", active: true }
];

const SettingsSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("tab") || "Personal Information";

  const handleTabChange = (tab: string) => {
    router.push(`?tab=${tab}`, { scroll: false });
  };

  return (
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
          {link.link}
        </button>
      ))}
    </div>
  );
};

export default SettingsSidebar;
