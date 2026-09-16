import { BrandPanel } from "@/components/landing/brand-panel";
import { Capabilities } from "@/components/landing/capabilities";
import { Contact } from "@/components/landing/contact";
import { Faq } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { Markets } from "@/components/landing/markets";
import { Method } from "@/components/landing/method";
import { News } from "@/components/landing/news";
import { Products } from "@/components/landing/products";
import { SectionRail } from "@/components/landing/section-rail";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { StatsBand } from "@/components/landing/stats-band";
import { Ticker } from "@/components/landing/ticker";

export default function LandingPage() {
  return (
    <>
      <SectionRail />

      {/* Header, hero and ticker share one navy surface so they read as a
          single masthead rather than three stacked bands. */}
      <BrandPanel glow="hero">
        <SiteHeader />
        <Hero />
        <Ticker />
      </BrandPanel>

      <main id="main" className="flex-1">
        <StatsBand />
        <Products />
        <Capabilities />
        <Method />
        <Markets />
        <News />
        <Faq />
        <Contact />
      </main>

      <SiteFooter />
    </>
  );
}
