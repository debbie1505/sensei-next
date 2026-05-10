"use client";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import ProductPreview from "./ProductPreview";
import WaitlistSection from "./WaitlistSection";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ProductPreview />
      <WaitlistSection />
      <Footer />
    </div>
  );
}
