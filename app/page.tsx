import Navbar from "@/components/Navbar";
import NavTicker from "@/components/NavTicker";
import Hero from "@/components/Hero";
import CityMarquee from "@/components/CityMarquee";
import Stats from "@/components/Stats";
import OneWayDestinations from "@/components/OneWayDestinations";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import WhyUs from "@/components/WhyUs";
import TrustBadges from "@/components/TrustBadges";
import CityServices from "@/components/CityServices";
import InfoStrip from "@/components/InfoStrip";
import ImportantInfo from "@/components/ImportantInfo";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import OfferPopup from "@/components/OfferPopup";

export default function Home() {
  return (
    <main>
      <Navbar />
      <NavTicker />
      <Hero />
      <CityMarquee />
      <InfoStrip />
      <ImportantInfo />
      <Stats />
      <OneWayDestinations />
      <Services />
      <HowItWorks />
      <WhyUs />
      <TrustBadges />
      <CityServices />
      <Testimonials />
      <Faq />
      <CtaBanner />
      <Footer />
      <FloatingButtons />
      <OfferPopup />
    </main>
  );
}
