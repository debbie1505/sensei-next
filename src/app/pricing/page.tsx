import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, X } from "lucide-react";
import type { PricingPlanId } from "@/utils/pricingSelection";

export const metadata: Metadata = {
  title: "Pricing | Admitra",
  description:
    "Choose the Admitra plan that keeps your full college application cycle aligned, from first draft to submission.",
};

const plans = [
  {
    planId: "free" as PricingPlanId,
    name: "Free",
    badge: "Start here",
    price: "$0",
    priceNote: "",
    cta: "Get Started Free",
    ctaHref: "/login?plan=free",
    features: [
      "Track up to 3 colleges",
      "Basic application dashboard",
      "Simple essay workspace",
      "Limited timeline generation",
      "Invite 1 reviewer",
    ],
  },
  {
    planId: "pass" as PricingPlanId,
    name: "Application Pass",
    badge: "Most popular",
    price: "$79 one-time",
    priceNote: "covers full application cycle",
    cta: "Get Full Access",
    ctaHref: "/login?plan=pass",
    features: [
      "Unlimited colleges and essays",
      "Full smart timeline (auto-adjusting)",
      "AI essay feedback (structured and actionable)",
      "Version history and draft comparison",
      "Unlimited reviewers (teachers, counselors)",
      "Priority deadline alerts",
      "Clean export for submission",
    ],
    footerNote: "One payment. Use it through your entire application season.",
    featured: true,
  },
  {
    planId: "pro" as PricingPlanId,
    name: "Pro Guidance",
    badge: "For serious applicants",
    price: "$149-$249 one-time",
    priceNote: "",
    cta: "Maximize My Chances",
    ctaHref: "/login?plan=pro",
    features: [
      "Everything in Application Pass",
      "Advanced AI essay rewrites (multi-mode)",
      "Final submission review checklist",
      "Personalized improvement suggestions",
      "Priority processing (faster feedback)",
    ],
  },
] as const;

const comparisonRows = [
  {
    feature: "College tracking",
    free: "3",
    pass: "Unlimited",
    pro: "Unlimited",
  },
  {
    feature: "Timeline system",
    free: "Basic",
    pass: "Full",
    pro: "Full",
  },
  {
    feature: "Essay feedback",
    free: "Limited",
    pass: "Full",
    pro: "Advanced",
  },
  {
    feature: "Collaboration",
    free: "1 reviewer",
    pass: "Unlimited",
    pro: "Unlimited",
  },
  {
    feature: "Version tracking",
    free: false,
    pass: true,
    pro: true,
  },
  {
    feature: "Final review tools",
    free: false,
    pass: false,
    pro: true,
  },
] as const;

const faqs = [
  {
    question: "Why not just use Google Docs?",
    answer:
      "Docs does not track deadlines, connect essays to schools, or show when you are falling behind. Admitra does.",
  },
  {
    question: "Do I need this if I already have a counselor?",
    answer:
      "Yes. Admitra makes collaboration structured instead of chaotic, so every review is tied to the right context.",
  },
  {
    question: "Is this a subscription?",
    answer: "No. Pay once and use it through your full application cycle.",
  },
  {
    question: "What if I do not apply to many schools?",
    answer:
      "Use the free plan. Upgrade only if you want full structure, deeper feedback, and unlimited collaboration.",
  },
] as const;

function ValueCell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex items-center justify-center text-primary">
        <Check className="h-5 w-5" aria-hidden />
        <span className="sr-only">Included</span>
      </span>
    ) : (
      <span className="inline-flex items-center justify-center text-muted-foreground">
        <X className="h-5 w-5" aria-hidden />
        <span className="sr-only">Not included</span>
      </span>
    );
  }

  return <span className="text-foreground">{value}</span>;
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="px-6 pt-20 pb-12 md:pt-24 md:pb-16 border-b border-border">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              Get your college applications under control.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Stop juggling docs, deadlines, and feedback. Use one system that keeps everything
              aligned from first draft to submission.
            </p>
          </div>
        </section>

        <section className="px-6 py-14 md:py-16 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <p className="inline-flex items-center rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-semibold mb-6">
              Most students choose Application Pass
            </p>
            <div className="grid lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <article
                key={plan.planId}
                className={`rounded-2xl border p-7 bg-card flex flex-col ${
                  plan.featured
                    ? "border-primary shadow-[0_0_0_1px_var(--color-primary)]"
                    : "border-border"
                }`}
              >
                <div className="mb-5">
                  <p
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      plan.featured
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {plan.badge}
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-foreground">{plan.name}</h2>
                <p className="text-3xl font-extrabold text-foreground mt-3">{plan.price}</p>
                {plan.priceNote ? (
                  <p className="text-sm text-muted-foreground mt-1">{plan.priceNote}</p>
                ) : null}

                <ul className="mt-6 space-y-3 text-sm text-muted-foreground flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className={`mt-7 inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition-opacity ${
                    plan.featured
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-secondary text-foreground hover:opacity-90"
                  }`}
                >
                  {plan.cta}
                </Link>
                {plan.footerNote ? (
                  <p className="text-xs text-muted-foreground mt-3 text-center">{plan.footerNote}</p>
                ) : null}
              </article>
            ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-14 md:py-16 border-b border-border">
          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full min-w-[720px] border border-border rounded-2xl overflow-hidden">
              <thead className="bg-secondary/70">
                <tr>
                  <th className="text-left p-4 text-foreground font-semibold">Feature</th>
                  <th className="text-left p-4 text-foreground font-semibold">Free</th>
                  <th className="text-left p-4 text-foreground font-semibold">Application Pass</th>
                  <th className="text-left p-4 text-foreground font-semibold">Pro</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="border-t border-border bg-card">
                    <td className="p-4 text-foreground font-medium">{row.feature}</td>
                    <td className="p-4">
                      <ValueCell value={row.free} />
                    </td>
                    <td className="p-4">
                      <ValueCell value={row.pass} />
                    </td>
                    <td className="p-4">
                      <ValueCell value={row.pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="px-6 py-14 md:py-16 border-b border-border bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
              Students spend months managing applications across scattered tools like Google Docs
              and spreadsheets and still miss deadlines or submit weak essays.
            </p>
            <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed mt-4">
              Admitra replaces that process with one system that keeps everything aligned.
            </p>
          </div>
        </section>

        <section className="px-6 py-14 md:py-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8">FAQ</h3>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <article key={faq.question} className="rounded-xl border border-border bg-card p-6">
                  <h4 className="text-lg font-semibold text-foreground">{faq.question}</h4>
                  <p className="text-muted-foreground mt-2">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
