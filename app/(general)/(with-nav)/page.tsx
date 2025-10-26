import LandingPageNew from "@/app/components/landing-page-new";
import DashboardNew from "@/app/components/dashboard-new";
import HowItWorks from "@/app/components/how-it-works";
import WhyLoveHubsell from "@/app/components/why-love-hubsell";
import SocialProof from "@/app/components/social-proof";
import FaqNew from "@/app/components/faq-new";
import CTABanner from "@/app/components/cta-banner";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex overflow-x-hidden flex-col">
      <Image
        src="/assets/landing-page/landingpage-noise.svg"
        alt="landing-page-new"
        fill
        className="w-full    object-cover fixed top-0 left-0 z-1000 h-[90vh]"
      />
      {/* <Landing /> */}
      <LandingPageNew />
      {/* <SimpleSteps 
      /> */}

      <DashboardNew />
      <HowItWorks />
      <WhyLoveHubsell />
      <SocialProof />
      <CTABanner />
      {/* <Use1 /> */}
      {/* <Testominal /> */}

      {/* <WhatIsIncluded /> */}
      <FaqNew />
      {/* <CTA /> */}
      {/* <About />
      <Categories />
      <Retro
        title="New Arrivals
"
        sub="Discover our latest arrivals, fresh styles designed to inspire."
      /> */}
      {/* <Faq /> */}
    </div>
  );
}
