import LandingPage from "@/components/LandingPage"
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <LandingPage/>
    </main>
  );
}
