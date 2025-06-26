"use client";
import Navbar from "./Navbar"
import Footer from "./Footer"
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import TestimonialsSection from "./TestimonialsSection";
import WaitlistSection from "./WaitlistSection";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar/>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <WaitlistSection />
      <Footer/>
    </main>
  );
}
