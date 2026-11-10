import { Contact } from "@/components/landing/contact";
import { Faq } from "@/components/landing/faq";
import { HelpBand } from "@/components/landing/help-band";
import { Hero } from "@/components/landing/hero";
import { Method } from "@/components/landing/method";
import { Products } from "@/components/landing/products";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { StatsBand } from "@/components/landing/stats-band";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main">
        <Hero />
        <StatsBand />
        <Products />
        <Method />
        <HelpBand />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}
