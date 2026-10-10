export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "What do you typically take on?",
    answer:
      "Mobile apps for iOS and Android, web products, AI features in live products, payments and subscriptions, and senior or lead roles on small teams. The tools I use are listed under Skills and tools.",
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
