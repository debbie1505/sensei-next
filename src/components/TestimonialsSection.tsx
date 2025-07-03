"use client";

const testimonials = [
  {
    quote: "Sensei gave me better feedback than my actual school counselor.",
    name: "Maya, 12th grade",
  },
  {
    quote: "I finally understand what colleges want to see in my essays.",
    name: "Jayden, Transfer Applicant",
  },
];

export default function TestimonialsSection() {
  return (
    <>
      <section id="testimonials" className="bg-gray-50 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-900">
          Student Reactions
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded shadow">
              <p className="text-gray-800 italic mb-4">“{t.quote}”</p>
              <p className="text-sm text-gray-500">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white py-8 px-6 text-center">
        <p className="text-gray-500 text-sm mb-2">Trusted by students from</p>
        <div className="flex justify-center gap-4 grayscale opacity-60">
          <img src="/logos/school1.svg" alt="School 1" className="h-8" />
          <img src="/logos/school2.svg" alt="School 2" className="h-8" />
          <img src="/logos/school3.svg" alt="School 3" className="h-8" />
        </div>
      </section>
    </>
  );
}
