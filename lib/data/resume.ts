/** ATS-oriented resume content — keep separate from marketing portfolio copy. */

export const resumeSummary =
  "Senior Full-Stack Engineer with 6+ years shipping React Native, Next.js, and AI products to production. Owned mobile/web clients, payments, and store releases for live apps with 10K+ Play installs. Top Rated Plus on Upwork (100% Job Success). Open to senior remote roles and high-value freelance.";

export const resumeSkills: Record<string, string[]> = {
  Languages: ["TypeScript", "JavaScript", "Python"],
  Mobile: ["React Native", "Expo", "EAS Updates", "App Store / Play Store release"],
  Frontend: ["Next.js", "React", "Tailwind CSS", "TanStack Query", "Redux", "Zustand"],
  Backend: ["Node.js", "FastAPI", "REST APIs", "GraphQL", "WebRTC", "Socket.io"],
  "AI / ML": ["OpenAI API", "Claude API", "AWS Bedrock", "YOLO11", "SAM2", "DINOv2"],
  "Cloud & Data": ["Firebase", "Supabase", "PostgreSQL", "MongoDB", "AWS", "Vercel"],
  Payments: ["Stripe", "RevenueCat", "In-App Purchases"],
  Practices: ["System design", "Code review", "Mentorship", "CI/CD", "Offline-first mobile"],
};

export type ResumeProject = {
  name: string;
  line: string;
  stack: string;
};

export const resumeProjects: ResumeProject[] = [
  {
    name: "Agenticly",
    line: "Frontend + payments for AI crypto/markets research — Expo & React clients, RevenueCat + Stripe; 10K+ Play downloads, 4.9★, App Store + web live.",
    stack: "React Native, Expo, React, Firebase, RevenueCat, Stripe",
  },
  {
    name: "Kitty Nip",
    line: "Full product ownership of live geo-social app (profiles, chat, IAP, Firebase) — 10K+ Play downloads, iOS + Android.",
    stack: "React Native, Firebase, Redux, IAP",
  },
  {
    name: "Qubio Ecosystem",
    line: "18-month international engagement — React Native, Next.js admin, D3 analytics for QR/NFC digital identity.",
    stack: "React Native, Next.js, D3.js, Node.js",
  },
  {
    name: "Innerverse",
    line: "Solo-founded mood journal with Skia cosmos UI, AI companion, and RevenueCat premium — live on Play Store + web.",
    stack: "React Native, Expo, Skia, OpenAI API, RevenueCat",
  },
  {
    name: "SafeDeal",
    line: "React Native shopping browser frontend for Amazon/eBay/AliExpress insights — 5K+ Play downloads, iOS + Android.",
    stack: "React Native, Expo, WebView",
  },
];
