import SmoothScroll from "@/components/providers/SmoothScroll";
import Cursor from "@/components/fx/Cursor";
import ScrollProgress from "@/components/chrome/ScrollProgress";
import Navbar from "@/components/chrome/Navbar";
import Dock from "@/components/chrome/Dock";
import Footer from "@/components/chrome/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import DoorExperience from "@/components/sections/DoorExperience";
import Process from "@/components/sections/Process";
import Factory from "@/components/sections/Factory";
import Stats from "@/components/sections/Stats";
import Configurator from "@/components/sections/Configurator";
import Gallery from "@/components/sections/Gallery";
import DealerMap from "@/components/sections/DealerMap";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <SmoothScroll>
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <DoorExperience />
        <Process />
        <Factory />
        <Stats />
        <Configurator />
        <Gallery />
        <DealerMap />
        <Contact />
      </main>
      <Footer />
      <Dock />
    </SmoothScroll>
  );
}
