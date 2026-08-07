export type ExperienceEntry = {
  company: string;
  role: string;
  type: string;
  location: string;
  period: string;
  /** One-line scope for About timeline */
  description: string;
  /** Quantified bullets for ATS resume */
  bullets: string[];
  stack: string[];
};

export const experience: ExperienceEntry[] = [
  {
    company: "StarComputer Labs",
    role: "Senior Full-Stack Engineer",
    type: "Full-Time Contract",
    location: "Remote · US-based company",
    period: "May 2025 – Present",
    description:
      "Senior engineer on a US product team shipping live AI mobile and web apps — clients, payments, and production ownership across concurrent products.",
    bullets: [
      "Own Expo/React Native and React web clients plus RevenueCat/Stripe entitlements for Agenticly, an AI markets research product live on Play Store (10K+ downloads, 4.9★), App Store, and web.",
      "Took full product ownership of Kitty Nip (geo social, chat, IAP, Firebase) — live on Play Store and App Store with 10K+ Play downloads.",
      "Ship AI product surfaces end-to-end (CatChat and related clients) against Firebase/cloud backends with US stakeholders on architecture and release trade-offs.",
      "Operate across mobile, web, payments, and third-party integrations from design handoff through store release on multiple concurrent products.",
    ],
    stack: ["React Native", "Expo", "Next.js", "Firebase", "Stripe", "RevenueCat", "OpenAI API", "Claude API"],
  },
  {
    company: "Jafrix System",
    role: "Founder & Lead Engineer",
    type: "Founder",
    location: "Lahore, Pakistan",
    period: "2019 – Present",
    description:
      "Studio founder shipping mobile-first AI products end-to-end — from scope and architecture through Play Store and web launches.",
    bullets: [
      "Built and published Innerverse solo (React Native, Expo, Skia, OpenAI, RevenueCat) — live on Play Store and web.",
      "Delivered BugMapper frontend for agri-tech field ops (offline sync, trap workflows, advisor charts) used in live greenhouse deployments.",
      "Building Dealflow AI and Decidr as AI SaaS products (Next.js, Expo, Supabase, Stripe, LLM APIs).",
      "Own full delivery loop for studio work: scoping, architecture, implementation, payments, and release.",
    ],
    stack: ["React Native", "Expo", "Next.js", "Supabase", "OpenAI API", "Stripe", "RevenueCat"],
  },
  {
    company: "Stackup Solutions",
    role: "Senior Software Engineer & Tech Lead",
    type: "Full-Time",
    location: "Lahore, Pakistan · Remote clients",
    period: "Feb 2021 – May 2025",
    description:
      "Led mobile and frontend engineering for international client products — architecture through App Store and Play Store releases.",
    bullets: [
      "Led frontend/mobile engineering across client products; owned codebases from architecture through store releases.",
      "Delivered Qubio Ecosystem over an 18-month engagement — React Native, Next.js admin, and D3 analytics for an international QR/NFC identity deployment.",
      "Shipped Meet & Greet (1:1 and group WebRTC calling on React Native) tuned for mid-tier devices and weak networks.",
      "Built BSchedule — paired staff/customer React Native apps on one Laravel scheduling and payments API.",
      "Mentored junior engineers, ran technical interviews, and set team standards for architecture and code review.",
    ],
    stack: ["React Native", "Next.js", "React", "Node.js", "WebRTC", "Laravel", "D3.js", "Firebase"],
  },
  {
    company: "Upwork",
    role: "Top Rated Plus Freelancer",
    type: "Freelance",
    location: "Remote · US, EU, APAC clients",
    period: "2019 – 2025",
    description:
      "Top Rated Plus freelancer (100% Job Success) shipping mobile, web, and AI products for international clients — including a long-term engagement that converted to full-time.",
    bullets: [
      "Maintained 100% Job Success as Top Rated Plus across mobile, web, and AI engagements ($70K+ earned).",
      "Delivered production apps for US/EU/APAC clients; one multi-year relationship converted to full-time at StarComputer Labs.",
      "Repeatedly owned end-to-end delivery: product UI, integrations, payments, and store submissions.",
    ],
    stack: ["React Native", "Next.js", "Node.js", "Firebase", "PostgreSQL", "Stripe"],
  },
];
