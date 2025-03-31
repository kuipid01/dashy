"use client";

import React from "react";
import PersonalInformation from "./pages/personal-information";
import { useSearchParams } from "next/navigation";
import Billing from "./pages/billing";
import Security from "./pages/security";
import Integrations from "./pages/integartion";
import Modifications from "./pages/modifications";

const Page = () => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");

  // Map search params to components
  const componentMap: Record<string, React.ReactNode> = {
    "Personal Information": <PersonalInformation />,
    Billing: <Billing />,
    Security: <Security />,
    Integrations: <Integrations />,
    Modifications: <Modifications />,
  };

  return <div>{componentMap[activeTab || ""] || <PersonalInformation />}</div>;
};

export default Page;
