export const PLAN_IDS = ["free", "pass", "pro"] as const;

export type PricingPlanId = (typeof PLAN_IDS)[number];

const PLAN_LABELS: Record<PricingPlanId, string> = {
  free: "Free",
  pass: "Application Pass",
  pro: "Pro Guidance",
};

export const PRICING_SELECTION_KEY = "admitra:selected-plan";

export function isPricingPlanId(value: string | null): value is PricingPlanId {
  return !!value && (PLAN_IDS as readonly string[]).includes(value);
}

export function getPricingPlanLabel(plan: PricingPlanId): string {
  return PLAN_LABELS[plan];
}
