import About from "./components/about";
import { Categories } from "./components/categories";
import Faq from "./components/faq";
import { Landing } from "./components/landingpage";
import Retro from "./components/retro";

export default function Home() {
  return (
    <div className="flex overflow-x-hidden flex-col">
      <Landing />

      <Retro
        title="    Retro Collections"
        sub=" Step back in time with vintage-inspired pieces that bring classic styles
        to the modern era. Timeless fashion, reimagined for today."
      />
      <About />
      <Categories />
      <Retro
        title="New Arrivals
"
        sub="Discover our latest arrivals, fresh styles designed to inspire."
      />
      <Faq />
    </div>
  );
}
