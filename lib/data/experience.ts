export type ExperienceEntry = {
  company: string;
  role: string;
  type: string;
  location: string;
  period: string;
  description: string;
  stack: string[];
};

export const experience: ExperienceEntry[] = [
  {
    company: "StarComputer Labs",
    role: "Senior Full-Stack Engineer",
    type: "Full-Time Contract",
    location: "Remote (US-based company)",
    period: "May 2025 – Present",
    description:
      "Lead engineer on all products. Responsible for architecture, mobile, web, payments, AI integrations, and deployments. Mentor junior backend developer. Originally started as an Upwork contract in 2019.",
    stack: ["React Native", "Next.js", "Firebase", "Stripe", "RevenueCat", "OpenAI API", "Claude API"],
  },
  {
    company: "Jafrix System",
    role: "Founder & Lead Engineer",
    type: "Founder",
    location: "Lahore, Pakistan",
    period: "2019 – Present",
    description:
      "Founded software studio focused on mobile-first AI products. Published Innerverse on the Play Store. Building Dealflow AI and Decidr as SaaS products.",
    stack: ["React Native", "Expo", "Next.js", "Supabase", "OpenAI API"],
  },
  {
    company: "Upwork",
    role: "Top Rated Plus Freelancer",
    type: "Freelance",
    location: "Remote",
    period: "2019 – 2025",
    description:
      "100% Job Success Score. $70,000+ earned across mobile, web, and AI projects. Clients across US, EU, and APAC. Converted to full-time with StarComputer Labs in 2025.",
    stack: ["React Native", "Next.js", "Node.js", "Firebase", "PostgreSQL"],
  },
];
