export type HireScope = {
  title: string;
  description: string;
};

export const hireScopes: HireScope[] = [
  {
    title: "React Native + Expo products",
    description:
      "Ship or rebuild iOS/Android apps — auth, offline, payments, store releases, and the messy mid-tier device reality.",
  },
  {
    title: "AI features into live products",
    description:
      "Chat, agents, RAG, streaming answers, and billing around them — production UX, not demo wrappers.",
  },
  {
    title: "0→1 MVPs (mobile + web)",
    description:
      "Fixed-scope builds with weekly demos: Expo / Next.js, Firebase or Postgres, Stripe / RevenueCat when money matters.",
  },
  {
    title: "Payments & subscriptions",
    description:
      "RevenueCat, Stripe, entitlements that stay coherent across phone and web so pay-once works everywhere.",
  },
  {
    title: "Architecture & tech lead help",
    description:
      "Second opinion on stack, AI feasibility, handoff quality, and whether to fix, refactor, or rewrite.",
  },
  {
    title: "Senior remote IC / lead roles",
    description:
      "Own surfaces end-to-end with a small team — mobile, web, and the integrations that keep them honest.",
  },
];
