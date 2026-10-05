import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Starting from "@/components/sections/Starting";
import RealScreens from "@/components/sections/RealScreens";

// Secciones pesadas o interactivas: se cargan aparte para mantener liviano el JS inicial.
const CutInternet = dynamic(() => import("@/components/sections/CutInternet"));
const DayStory = dynamic(() => import("@/components/sections/DayStory"));
const MixedPayment = dynamic(() => import("@/components/sections/MixedPayment"));
const Modules = dynamic(() => import("@/components/sections/Modules"));
const Architecture = dynamic(() => import("@/components/sections/Architecture"));
const Faq = dynamic(() => import("@/components/sections/Faq"));
const LeadForm = dynamic(() => import("@/components/sections/LeadForm"));

export default function Home() {
  return (
    <>
      <Header />
      <main>
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
    </>
  );
}
