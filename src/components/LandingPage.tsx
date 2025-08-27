"use client";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import ProductPreview from "./ProductPreview";
import TestimonialsSection from "./TestimonialsSection";
import WaitlistSection from "./WaitlistSection";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* 1. Hero (Above the Fold) */}
      <HeroSection />
      
      {/* 2. Social Proof / Credibility Strip - Built into Hero */}
      
      {/* 3. Value Props */}
      <FeaturesSection />
      
      {/* 4. How It Works - Built into FeaturesSection */}
      
      {/* 5. Product Preview */}
      <ProductPreview />
      
      {/* 6. Equity Promise - Built into FeaturesSection */}
      
      {/* 7. Waitlist Module (Primary Conversion) */}
      <WaitlistSection />
      
      {/* 8. Secondary CTAs - Distributed throughout */}
      
      {/* 9. FAQ */}
      <TestimonialsSection />
      
      {/* 10. Compliance & Privacy Callout - Built into TestimonialsSection */}
      
      {/* 11. Footer */}
      <Footer />
    </div>
  );
}
