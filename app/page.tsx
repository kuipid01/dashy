import About from "./components/about";
import { Categories } from "./components/categories";
import Faq from "./components/faq";
import { Landing } from "./components/landingpage";
import Retro from "./components/retro";
import { SimpleSteps } from "./components/simple-steps";

export default function Home() {
  return (
    <div className="flex overflow-x-hidden flex-col">
      <Landing />

      <SimpleSteps 
      />
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
