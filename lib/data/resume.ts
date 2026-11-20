/** Printable resume content. Mirrors the CV in the Portfolio Kit (Nov 2026); keep the two in step. */

export const resumeSummary =
  "Senior engineer with nearly six years of experience across React Native and Next.js, owning products end to end: the mobile and web clients, the Firebase backends behind them, and the Stripe and RevenueCat billing that decides who gets access. Strongest on what has to keep working after launch, including offline-first sync, store billing, authentication and releases. Has owned live apps with 10K+ and 100K+ downloads, led teams of up to nine, and put LLM-backed features into production.";

export const resumeSkills: Record<string, string[]> = {
  Mobile: [
    "React Native",
    "Expo",
    "New Architecture (Fabric, TurboModules)",
    "iOS",
    "Android",
    "Skia",
    "Reanimated",
    "Vision Camera",
    "NFC",
    "In-app purchases",
    "EAS Build and EAS Update",
    "App Store and Google Play releases",
  ],
  Web: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Vite", "PWA", "D3.js"],
  "Backend and Cloud": [
    "Node.js",
    "Express",
    "Laravel",
    "Firebase (Auth, Firestore, Cloud Functions)",
    "Supabase",
    "PostgreSQL",
    "MongoDB",
    "SQLite",
    "GraphQL",
    "REST",
    "AWS Bedrock",
  ],
  "State and Data": ["Zustand", "Redux Toolkit", "React Query", "RTK Query", "Turborepo monorepos"],
  "AI Integration": ["OpenAI API", "Claude API (Anthropic)", "OpenRouter", "LLM integration", "AI agents"],
  "Payments and Realtime": ["Stripe", "RevenueCat", "MangoPay", "WebRTC", "Agora", "Socket.IO"],
  "Testing and Monitoring": ["Jest", "Detox", "Sentry", "Firebase Crashlytics", "ESLint", "Prettier", "Git", "GitHub Actions", "Code review"],
  "Analytics and Growth": ["AppsFlyer", "Microsoft Clarity", "HubSpot", "Firebase Analytics"],
  Practices: ["Offline-first sync", "Internationalisation (i18next)", "Agile and Scrum", "Team leadership", "Mentoring", "Technical interviewing"],
};

export type ResumeProject = {
  name: string;
  line: string;
  stack: string;
};

export const resumeProjects: ResumeProject[] = [
  {
    name: "Safe Deal",
    line: "React Native shopping browser that gives product verdicts for Amazon, eBay and AliExpress. As a contributor, moved state from Redux and Context to Zustand and reworked data fetching with React Query.",
    stack: "React Native, Expo, WebView, Zustand, React Query",
  },
  {
    name: "Decidr",
    line: "Decision-matrix web app with weighted criteria, AI scoring and an explainable reasoning trace. Personal project, deployed publicly during development.",
    stack: "Next.js, Supabase, OpenRouter",
  },
  {
    name: "RealHelp",
    line: "Marketplace for hiring experts with messaging, video and audio calls.",
    stack: "React Native, Next.js, Firebase, Cloud Functions, Agora",
  },
  {
    name: "Interior Assistant (Interio)",
    line: "AR and ML furniture placement app. Started in 2019 on React Native 0.62 with a custom TensorFlow Lite model; rebuilt in 2026 on Expo SDK 53 and React Native 0.79 with on-device ML Kit detection.",
    stack: "React Native, Expo, ViroReact, ML Kit, TensorFlow Lite, Firebase",
  },
];

export const resumeEducation =
  "Bachelor of Science in Computer Science, COMSATS University Islamabad, Lahore campus · 2016 – 2020";

export const resumeCertifications =
  "Zero To Mastery: Complete React Developer, Complete React Native Developer, Advanced JavaScript, MERN Stack Mastery";

export const resumeLanguages = "English (C1 to C2), Urdu (native)";
