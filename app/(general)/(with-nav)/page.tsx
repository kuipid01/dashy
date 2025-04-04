import { CTA } from "../../components/cta";
import { Landing } from "../../components/landingpage";
// import Retro from "./components/retro";
import Testominal from "../../components/testimonials";
import { Use1 } from "../../components/use-1";
import { WhatIsIncluded } from "../../components/what-is-included";

export default function Home() {
  return (
    <div className="flex overflow-x-hidden flex-col">
      <Landing />

      {/* <SimpleSteps 
      /> */}
    
      <Use1 />
      <Testominal />
      
      <WhatIsIncluded />
      <CTA />
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
