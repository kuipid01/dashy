import About from "./components/about";
import { Categories } from "./components/categories";
import { CTA } from "./components/cta";
import Faq from "./components/faq";
import { Landing } from "./components/landingpage";
import Retro from "./components/retro";
import { SimpleSteps } from "./components/simple-steps";
import { Use1 } from "./components/use-1";
import { WhatIsIncluded } from "./components/what-is-included";

export default function Home() {
  return (
    <div className="flex overflow-x-hidden flex-col">
      <Landing />

      <SimpleSteps 
      />
      <Use1 />
      <div className=" h-screen bg-primary border-b border-black border-dashed"></div>
      <WhatIsIncluded />
      <CTA />
      {/* <About />
      <Categories />
      <Retro
        title="New Arrivals
"
        sub="Discover our latest arrivals, fresh styles designed to inspire."
      /> */}
      <Faq />
    </div>
  );
}
