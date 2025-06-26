"use client";

const features = [
  {
    title: "🧠 Essay Feedback",
    description: "AI-powered suggestions for standout essays",
  },
  {
    title: "📅 Timeline Generator",
    description: "A custom admissions calendar made for your goals",
  },
  {
    title: "👨‍🏫 Always-On Mentor",
    description: "24/7 answers from your AI admissions guide",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 px-6 bg-white text-center">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">What Sensei Can Do</h2>
      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {features.map((f) => (
          <div
            key={f.title}
            className="border rounded-lg shadow p-6 bg-gray-50 hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
