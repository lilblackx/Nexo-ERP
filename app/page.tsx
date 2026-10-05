import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import ProductGallery from "@/components/ProductGallery";
import Modules from "@/components/Modules";
import MultiCurrency from "@/components/MultiCurrency";
import Architecture from "@/components/Architecture";
import UseCases from "@/components/UseCases";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <ProductGallery />
        <Modules />
        <MultiCurrency />
        <Architecture />
        <UseCases />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
