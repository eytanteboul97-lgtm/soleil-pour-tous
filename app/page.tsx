import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { TrustSection } from "@/components/trust-section";
import { Simulator } from "@/components/simulator";
import { ChatQualification } from "@/components/chat-qualification";
import { AidesTable } from "@/components/aides-table";
import { SunlightSection } from "@/components/sunlight-section";
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
        <Simulator />
        <ChatQualification />
        <AidesTable />
        <SunlightSection />
        <ProcessSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
