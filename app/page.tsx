import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { TrustSection } from "@/components/trust-section";
import { LeadFormSection } from "@/components/lead-form";
import { AidesTable } from "@/components/aides-table";
import { Simulator } from "@/components/simulator";
import { ProcessSection } from "@/components/process-section";
import { FAQ } from "@/components/faq";
import { FinalCTA } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { StickyMobileCTA } from "@/components/sticky-mobile-cta";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustSection />
        <LeadFormSection />
        <AidesTable />
        <Simulator />
        <ProcessSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
