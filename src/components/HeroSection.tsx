"use client";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-20 relative overflow-hidden bg-gradient-to-br from-blue-50 to-white">
      <div className="absolute -top-10 -left-10 w-[300px] h-[300px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
      <div className="absolute -bottom-20 -right-10 w-[300px] h-[300px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
      <h1 className="text-5xl font-extrabold mb-4 text-gray-900">
        No rich parents. No Ivy counselor.{" "}
        <span className="text-blue-600">Just you, Sensei, and the grind.</span>
      </h1>
      <p className="text-xl text-gray-700 max-w-2xl">
        Sensei helps you build a strategic game plan for college and stand out—
        without a private counselor.
      </p>
    </section>
  );
}
