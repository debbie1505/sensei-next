"use client";
import { useState } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Sensei gave me better feedback than my actual school counselor. The AI suggestions were incredibly specific and actionable.",
    name: "Maya Chen",
    role: "12th Grade Student",
    school: "Accepted to Stanford",
    rating: 5
  },
  {
    quote: "I finally understand what colleges want to see in my essays. The rubric scoring helped me identify exactly what to improve.",
    name: "Jayden Rodriguez",
    role: "Transfer Applicant",
    school: "Accepted to UCLA",
    rating: 5
  },
  {
    quote: "The timeline feature kept me organized throughout the entire application process. I never missed a deadline!",
    name: "Sarah Johnson",
    role: "12th Grade Student",
    school: "Accepted to Harvard",
    rating: 5
  },
  {
    quote: "The scholarship matcher found opportunities I never would have discovered on my own. It's like having a personal research assistant.",
    name: "Alex Thompson",
    role: "12th Grade Student",
    school: "Accepted to MIT",
    rating: 5
  }
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="bg-gradient-to-br from-gray-50 to-blue-50 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            What Students Are{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Saying
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of students who have transformed their college admissions journey with Sensei.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-500 ${
                index === activeIndex ? 'scale-105 shadow-xl' : 'scale-100'
              }`}
            >
              {/* Quote Icon */}
              <div className="flex justify-between items-start mb-6">
                <Quote className="w-8 h-8 text-blue-500 opacity-50" />
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-blue-600 font-medium">{testimonial.school}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-blue-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Trusted by Students Worldwide
            </h3>
            <p className="text-gray-600">
              Join a community of ambitious students achieving their college dreams
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600 text-sm">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">500+</div>
              <div className="text-gray-600 text-sm">Colleges Applied</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-600 text-sm">Acceptance Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">$2M+</div>
              <div className="text-gray-600 text-sm">Scholarships Won</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
