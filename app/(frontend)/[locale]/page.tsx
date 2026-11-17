import { Company } from "@/components/landing/company";
import { Contact } from "@/components/landing/contact";
import { Faq } from "@/components/landing/faq";
import { HelpBand } from "@/components/landing/help-band";
import { Hero } from "@/components/landing/hero";
import { Method } from "@/components/landing/method";
import { Products } from "@/components/landing/products";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Vision } from "@/components/landing/vision";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main">
        <Hero />
        <Company />
        <Vision />
        <Method />
        <Products />
        <HelpBand />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}
