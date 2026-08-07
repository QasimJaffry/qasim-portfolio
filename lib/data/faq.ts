export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "What do you typically take on?",
    answer:
      "React Native / Expo apps, Next.js product surfaces, AI features in live products, payments (Stripe / RevenueCat), and senior IC or tech-lead help on small teams. See the Hire me for section for the full list.",
  },
  {
    question: "Freelance, full-time, or both?",
    answer:
      "Both. I’m open to high-value freelance and consulting, and to senior/lead remote roles in roughly the $50K–$120K range depending on scope and location.",
  },
  {
    question: "Timezone and communication?",
    answer:
      "Based in Lahore (PKT). I work comfortably with US and EU teams — async by default, overlap calls when needed. I usually reply within 24 hours.",
  },
  {
    question: "Can you join an existing codebase?",
    answer:
      "Yes — often. I slot in as a senior IC, match your PR process and stack, and leave the repo in a state your team can keep shipping.",
  },
  {
    question: "NDAs and IP?",
    answer:
      "Standard. Client IP stays with the client. Case studies here only cover public products or work I’m allowed to discuss.",
  },
  {
    question: "How fast can you start?",
    answer:
      "Depends on current load. Reach out with the problem and timeline — I’ll give a straight answer on availability within a day.",
  },
];
