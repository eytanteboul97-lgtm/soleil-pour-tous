import { Navbar } from "@/components/navbar";
import { ChatQualification } from "@/components/chat-qualification";
import { TrustSection } from "@/components/trust-section";
import { SolutionsSection } from "@/components/solutions-section";
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
      <main id="main-content">
        <ChatQualification />
        <TrustSection />
        <SolutionsSection />
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
