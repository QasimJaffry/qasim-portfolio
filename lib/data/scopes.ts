export type HireScope = {
  title: string;
  description: string;
};

/**
 * What I take on, described by the work and the outcome. Tool names live in the Skills
 * section, not here.
 */
export const hireScopes: HireScope[] = [
  {
    title: "mobile apps for iOS and Android",
    description:
      "One product on both stores, from sign-in and offline support to store releases and updates, built to feel right on mid-range phones too.",
  },
  {
    title: "AI features in live products",
    description:
      "Assistants and agents that answer from your own data, with streaming responses and usage billing around them. Built for production, not demos.",
  },
  {
    title: "MVPs from idea to launch",
    description:
      "Fixed-scope builds across mobile and web with a working demo every week, ready for real users and real payments.",
  },
  {
    title: "payments and subscriptions",
    description:
      "Checkout, subscriptions and access rules that stay consistent across phone and web, so a customer who pays once is covered everywhere.",
  },
  {
    title: "technical direction and architecture",
    description:
      "A second opinion on architecture, AI feasibility and handoff quality, with a clear answer on whether to fix, refactor or rewrite.",
  },
  {
    title: "senior and lead roles on small teams",
    description:
      "Owning mobile, web and the integrations between them as part of a small team, from first commit to production.",
  },
];
