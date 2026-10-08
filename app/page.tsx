import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import MobileCta from "@/components/MobileCta";
import RealScreens from "@/components/sections/RealScreens";
import Starting from "@/components/sections/Starting";
import Faq from "@/components/sections/Faq";

// Secciones pesadas o interactivas: se cargan aparte para mantener liviano el JS inicial.
const CutInternet = dynamic(() => import("@/components/sections/CutInternet"));
const DayStory = dynamic(() => import("@/components/sections/DayStory"));
const MixedPayment = dynamic(() => import("@/components/sections/MixedPayment"));
const Modules = dynamic(() => import("@/components/sections/Modules"));
const Architecture = dynamic(() => import("@/components/sections/Architecture"));
const LeadForm = dynamic(() => import("@/components/sections/LeadForm"));

export default function Home() {
  return (
    <>
      <Header />
      <main id="contenido">
        <Hero />
        <CutInternet />
        <DayStory />
        <MixedPayment />
        <Modules />
        <RealScreens />
        <Architecture />
        <Starting />
        <Faq />
        <LeadForm />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
