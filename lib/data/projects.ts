export type ProjectCategory = "Mobile" | "Web" | "AI" | "Full-Stack";
export type ProjectStatus = "Live" | "In Development" | "Completed";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  stack: string[];
  metrics: string[];
  status: ProjectStatus;
  featured: boolean;
  links: {
    playStore?: string;
    appStore?: string;
    web?: string;
    github?: string;
    demo?: string;
  };
  images: string[];
  /** Optional app / product icon shown on the case study */
  icon?: string;
  year: string;
};

export const projects: Project[] = [
  {
    slug: "agenticly",
    title: "Agenticly",
    tagline: "Ask crypto and markets in plain English — analytics, charts, insights.",
    description:
      "Solo-shipped product: Expo mobile + React web against Firebase and a FastAPI/LangGraph research backend. Natural-language queries across crypto, on-chain, and stocks with streaming answers and charts — RevenueCat on mobile, Stripe on web, one entitlement model.",
    category: "AI",
    stack: ["React Native", "Expo", "React", "Firebase", "FastAPI", "LangGraph", "RevenueCat", "Stripe"],
    metrics: [
      "Live on Play Store + web",
      "Mobile + web subscriptions",
      "Built and shipped solo",
    ],
    status: "Live",
    featured: true,
    links: {
      playStore: "https://play.google.com/store/apps/details?id=computer.star.agenticly",
      web: "https://agenticly.app",
    },
    images: [
      "/images/projects/agenticly/hero.jpg",
      "/images/projects/agenticly/detail-1.jpg",
      "/images/projects/agenticly/detail-2.jpg",
    ],
    year: "2024–present",
  },
  {
    slug: "innerverse",
    title: "Innerverse",
    tagline: "Log moods as stars in a personal galaxy — with an AI companion.",
    description:
      "Solo founder product under Jafrix Systems: React Native + Expo + Skia cosmos visualization, Mira AI for pattern reflection, meditation library, and RevenueCat premium. Live on Play Store and the web.",
    category: "Mobile",
    stack: ["React Native", "Expo", "Skia", "Firebase", "OpenAI API", "RevenueCat"],
    metrics: [
      "Live on Play Store + web",
      "Skia cosmos mood journal",
      "Built and published solo",
    ],
    status: "Live",
    featured: true,
    links: {
      playStore: "https://play.google.com/store/apps/details?id=innerverse.app",
      web: "https://innerverse.app",
      github: "https://github.com/QasimJaffry/Innerverse",
    },
    images: [
      "/images/projects/innerverse/hero.jpg",
      "/images/projects/innerverse/detail-1.jpg",
    ],
    year: "2025–present",
  },
  {
    slug: "qubio",
    title: "Qubio Ecosystem",
    tagline: "QR/NFC digital identity pages you edit from phone or web.",
    description:
      "18-month engagement on a cross-platform identity system: React Native for scan/register and page editing, web admin for management, and a D3 analytics view of how the network is used — shared API for an international client deployment.",
    category: "Full-Stack",
    stack: ["React Native", "React", "D3.js", "Node.js", "NFC / QR"],
    metrics: [
      "18-month engagement",
      "Mobile + web + analytics",
      "International client deploy",
    ],
    status: "Completed",
    featured: true,
    links: {
      web: "https://pages.qubio.me/",
    },
    images: [
      "/images/projects/qubio/hero.png",
      "/images/projects/qubio/detail-1.png",
      "/images/projects/qubio/detail-2.png",
      "/images/projects/qubio/detail-3.png",
    ],
    year: "2022",
  },
  {
    slug: "realtag",
    title: "RealTag",
    tagline: "Tag any object in a live camera feed — and find it again later.",
    description:
      "Hybrid ML app: React Native Vision Camera client + FastAPI server. YOLO11 detects, SAM2 segments (auto or tap-to-mask), DINOv2 embeds crops so the same physical object can be re-identified across frames, angles, and lighting — with custom tags stored on-device.",
    category: "AI",
    stack: ["React Native", "Vision Camera", "YOLO11", "SAM2", "DINOv2", "FastAPI"],
    metrics: [
      "Detect → segment → embed pipeline",
      "Tap-to-segment + auto masks",
      "Embedding re-ID across frames",
    ],
    status: "Completed",
    featured: false,
    links: {},
    images: [
      "/images/projects/realtag/hero.jpg",
      "/images/projects/realtag/detail-1.jpg",
      "/images/projects/realtag/detail-2.jpg",
    ],
    icon: "/images/projects/realtag/icon-256.png",
    year: "2026",
  },
  {
    slug: "kitty-nip",
    title: "Kitty Nip",
    tagline: "Location-based cat social — swipe, match, chat.",
    description:
      "Took over full product ownership of a live React Native dating-style social app: geo discovery, cat + human profiles, private chat with media, push, ads, and IAP premium — Firebase Auth/Firestore/Functions end to end. Live on Play Store and App Store.",
    category: "Mobile",
    stack: ["React Native", "Firebase", "Redux", "IAP", "Geolocation"],
    metrics: [
      "10,000+ Play Store downloads",
      "Full product ownership",
      "iOS + Android live",
    ],
    status: "Live",
    featured: false,
    links: {
      playStore: "https://play.google.com/store/apps/details?id=computer.star.kittynip",
      appStore: "https://apps.apple.com/us/app/kitty-nip-cat-dating-app/id1520805359",
    },
    images: [
      "/images/projects/kitty-nip/hero.jpg",
      "/images/projects/kitty-nip/detail-1.jpg",
      "/images/projects/kitty-nip/detail-2.jpg",
    ],
    year: "2020–present",
  },
  {
    slug: "meet-and-greet",
    title: "Meet & Greet",
    tagline: "1:1 and group video/voice calling with WebRTC.",
    description:
      "React Native calling product: online presence, dial-by-ID, 1:1 and group video/voice over WebRTC, with Socket.io signaling on Node.js designed for real mobile networks — not demo Wi-Fi.",
    category: "Full-Stack",
    stack: ["React Native", "WebRTC", "Socket.io", "Node.js"],
    metrics: [
      "1:1 and group calls",
      "Production WebRTC path",
      "Real-time signaling",
    ],
    status: "Completed",
    featured: false,
    links: {},
    images: [
      "/images/projects/meet-and-greet/hero.jpg",
      "/images/projects/meet-and-greet/detail-1.jpg",
      "/images/projects/meet-and-greet/detail-2.jpg",
    ],
    year: "2023",
  },
  {
    slug: "bugmapper",
    title: "BugMapper",
    tagline: "Field app for greenhouse trap work, offline sync, and PIM® photo upload.",
    description:
      "React Native + web frontend for BugMapper’s agri-tech platform — QR trap deployment, offline-first sync, PIM® photo upload, and the charts/maps advisors use in the greenhouse loop.",
    category: "Full-Stack",
    stack: ["React Native", "Expo", "SQLite", "Offline-first", "Web"],
    metrics: [
      "~10 sec per trap vs 5–10 min manual counts",
      "30–50% seasonal chemical savings reported",
      "Live across Kayseri, Yozgat, Afyon & Mersin",
    ],
    status: "Live",
    featured: false,
    links: {
      web: "https://www.bugmapper.com.tr/",
    },
    images: [
      "/images/projects/bugmapper/hero.jpg",
      "/images/projects/bugmapper/detail-1.jpg",
      "/images/projects/bugmapper/detail-2.jpg",
    ],
    year: "2023–present",
  },
  {
    slug: "safedeal",
    title: "SafeDeal",
    tagline: "AI shopping browser for Amazon, eBay, and AliExpress — verdicts, not guesswork.",
    description:
      "React Native frontend for Safe Deal’s mobile shopping browser — in-app WebView for major marketplaces, product/seller rules, AI review summaries, and price history in one sheet.",
    category: "Mobile",
    stack: ["React Native", "Expo", "WebView", "React Query"],
    metrics: [
      "5K+ downloads on Google Play",
      "6M+ products checked on the platform",
      "4.5★ Play Store rating",
    ],
    status: "Live",
    featured: false,
    links: {
      web: "https://www.joinsafedeal.com/",
      playStore:
        "https://play.google.com/store/apps/details?id=com.safedeal.navigator&pli=1",
    },
    images: [
      "/images/projects/safedeal/hero.jpg",
      "/images/projects/safedeal/detail-1.jpg",
      "/images/projects/safedeal/detail-2.jpg",
    ],
    year: "2023–present",
  },
  {
    slug: "bschedule",
    title: "BSchedule",
    tagline: "Staff and customer booking apps on one scheduling API.",
    description:
      "Two React Native clients — staff/admin and customer — against a single Laravel REST API: appointments, calendar/timeline, job cards, notices, and garage-style service categories. One schedule source of truth for both audiences.",
    category: "Mobile",
    stack: ["React Native", "Laravel", "MySQL", "REST API", "Redux"],
    metrics: [
      "Two apps, one API",
      "Staff + customer portals",
      "Production booking system",
    ],
    status: "Completed",
    featured: false,
    links: {
      web: "https://bscheduled.co.uk/",
    },
    images: [
      "/images/projects/bschedule/hero.png",
      "/images/projects/bschedule/detail-1.png",
      "/images/projects/bschedule/detail-2.png",
    ],
    year: "2021–2022",
  },
  {
    slug: "catchat",
    title: "CatChat",
    tagline: "AI cat companions — generated characters, in-character chat, PWA.",
    description:
      "Full-stack AI companion product: Next.js PWA for browsing generated cats and chatting in character, with Firebase Auth/Firestore and Cloud Functions for LLM chat and image generation.",
    category: "AI",
    stack: ["Next.js", "Firebase", "Cloud Functions", "OpenAI / OpenRouter"],
    metrics: [
      "AI-generated cat profiles + portraits",
      "In-character chat with memory",
      "Installable PWA on Firebase Hosting",
    ],
    status: "Live",
    featured: false,
    links: {
      web: "https://catchatapp-6f11c.web.app/",
    },
    images: [
      "/images/projects/catchat/hero.jpg",
      "/images/projects/catchat/detail-1.jpg",
      "/images/projects/catchat/detail-2.jpg",
    ],
    year: "2023–present",
  },
  {
    slug: "dealflow-ai",
    title: "Dealflow AI",
    tagline: "AI-native CRM for freelancers — deals, tasks, and follow-ups in one place.",
    description:
      "Personal product: Next.js web + Expo mobile sharing a Supabase backend. Pipeline for clients and deals, activity timeline, and AI that summarizes deals, extracts next actions, and drafts follow-ups — with an offline demo mode so the full UI works without env keys.",
    category: "AI",
    stack: ["Next.js", "Expo", "Supabase", "OpenAI / OpenRouter", "TypeScript"],
    metrics: [
      "Web + mobile, one backend",
      "AI summary → approve → tasks",
      "Offline preview with demo data",
    ],
    status: "In Development",
    featured: false,
    links: {},
    images: [
      "/images/projects/dealflow-ai/hero.jpg",
      "/images/projects/dealflow-ai/detail-1.jpg",
      "/images/projects/dealflow-ai/detail-2.jpg",
      "/images/projects/dealflow-ai/detail-3.jpg",
    ],
    year: "2026",
  },
  {
    slug: "decidr",
    title: "Decidr",
    tagline: "Turn messy dilemmas into weighted, explainable decisions.",
    description:
      "Personal SaaS: paste a dilemma or walk a wizard — options, criteria, and weights become a scored matrix with ranking, risk, confidence, and an AI reasoning trace. What-if weight simulation, side-by-side compare, share links, and Stripe Pro on Next.js + Supabase + OpenRouter.",
    category: "AI",
    stack: ["Next.js", "TypeScript", "Supabase", "Stripe", "OpenRouter"],
    metrics: [
      "Weighted option × criteria matrices",
      "Explainable AI scoring + what-if",
      "Live demo + Stripe billing",
    ],
    status: "In Development",
    featured: false,
    links: {
      github: "https://github.com/QasimJaffry/Decidr",
      demo: "https://decidr-henna.vercel.app/",
    },
    images: [
      "/images/projects/decidr/hero.jpg",
      "/images/projects/decidr/detail-1.jpg",
      "/images/projects/decidr/detail-2.jpg",
      "/images/projects/decidr/detail-3.jpg",
    ],
    year: "2026",
  },
  {
    slug: "interio",
    title: "Interio",
    tagline: "Scan a room, detect furniture, place pieces in AR — before you buy.",
    description:
      "Side project that started as my 2019 FYP and that I still ship on. Expo / React Native: on-device ML Kit furniture detection, post-scan layout tips and catalogue matches, then ViroReact true-scale AR placement with drag, pinch, and twist — Firebase for auth, favourites, and catalogue.",
    category: "Mobile",
    stack: ["React Native", "Expo", "ViroReact", "ML Kit", "Firebase"],
    metrics: [
      "FYP origin · still iterating",
      "On-device detection → AR try-on",
      "True-scale GLB placement",
    ],
    status: "Completed",
    featured: false,
    links: {},
    images: [
      "/images/projects/interio/hero.jpg",
      "/images/projects/interio/detail-1.jpg",
      "/images/projects/interio/detail-2.jpg",
    ],
    year: "2019–present",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}
