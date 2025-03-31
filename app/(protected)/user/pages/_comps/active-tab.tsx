"use client";

import { useSearchParams } from "next/navigation";
import PersonalInformation from "../personal-information";
import Billing from "../billing";
import Security from "../security";
import Integrations from "../integartion";
import Modifications from "../modifications";

const ActiveTabContent = () => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");

  const componentMap: Record<string, React.ReactNode> = {
    "Personal Information": <PersonalInformation />,
    Billing: <Billing />,
    Security: <Security />,
    Integrations: <Integrations />,
    Modifications: <Modifications />,
  };

  return <>{componentMap[activeTab || ""] || <PersonalInformation />}</>;
};

export default ActiveTabContent;
