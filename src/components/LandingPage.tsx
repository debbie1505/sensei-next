"use client";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import ProductPreview from "./ProductPreview";
import WaitlistSection from "./WaitlistSection";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <ProductPreview />
      <WaitlistSection />
      <Footer />
    </div>
  );
}
