export type ProjectCategory = "Mobile" | "Web" | "AI" | "Full-Stack";
export type ProjectStatus = "Live" | "In Development" | "Completed";

export type ProjectSummary = {
  problem: string;
  action: string;
  result: string;
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  /** Scannable Problem → Action → Result for the first screen */
  summary?: ProjectSummary;
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
    tagline: "Ask about crypto and stocks in plain language; get tables, charts and written answers.",
    description:
      "AI crypto and stock research assistant on Google Play, the App Store and web. I led the engineering on this team product: the React Native app, the Next.js web client, the Firebase backend and Functions, scheduled agents, and payments.",
    summary: {
      problem: "One research product had to reach users on web, Android and iOS, with paid agents that behave the same on every device.",
      action:
        "Led the engineering: React Native app, Next.js web client, Firebase backend and Functions, scheduled agents, and one subscription record written by RevenueCat on mobile and Stripe on web.",
      result: "26K installs across web, Android and iOS combined, about 2.3K monthly active users, typically 100% crash-free on Crashlytics.",
    },
    category: "AI",
    stack: ["React Native", "Expo", "Next.js", "Firebase", "Cloud Functions", "RevenueCat", "Stripe"],
    metrics: [
      "26K installs across web, Android and iOS",
      "About 2.3K monthly active users",
      "Typically 100% crash-free",
    ],
    status: "Live",
    featured: true,
    links: {
      playStore: "https://play.google.com/store/apps/details?id=computer.star.agenticly",
      appStore: "https://apps.apple.com/us/app/agenticly-stock-crypto-ai/id6760048191",
      web: "https://agenticly.app",
    },
    images: [
      "/images/projects/agenticly/hero.jpg",
      "/images/projects/agenticly/slide-1.jpg",
      "/images/projects/agenticly/slide-2.jpg",
      "/images/projects/agenticly/slide-3.jpg",
      "/images/projects/agenticly/slide-4.jpg",
      "/images/projects/agenticly/slide-5.jpg",
      "/images/projects/agenticly/slide-6.jpg",
    ],
    year: "2024–present",
  },
  {
    slug: "innerverse",
    title: "Innerverse",
    tagline: "A mood journal where every entry becomes a world on your galaxy map.",
    description:
      "Mood journal for Android, live on Google Play. I designed, built and published it solo under Jafrix Systems with Expo, React Native, Skia, Reanimated, Zustand, Firebase and RevenueCat.",
    summary: {
      problem: "Mood tracking apps feel like forms. Logging should be quick, and the patterns should be something you want to look at.",
      action:
        "Designed and built it solo: a Skia galaxy where each entry becomes a world, a pick-intensity-tag logging flow, month star charts and time-of-day patterns, and RevenueCat subscriptions with server-owned entitlements.",
      result: "Live on Google Play. Journal text stays private by design: no entry text is sent to any AI service in the shipped app.",
    },
    category: "Mobile",
    stack: ["Expo", "React Native", "Skia", "Reanimated", "Zustand", "Firebase", "RevenueCat"],
    metrics: [
      "Live on Google Play",
      "Designed, built and published solo",
      "No journal text sent to any AI service",
    ],
    status: "Live",
    featured: true,
    links: {
      playStore: "https://play.google.com/store/apps/details?id=innerverse.app",
      github: "https://github.com/QasimJaffry/Innerverse",
    },
    images: [
      "/images/projects/innerverse/hero.jpg",
      "/images/projects/innerverse/slide-1.jpg",
      "/images/projects/innerverse/slide-2.jpg",
      "/images/projects/innerverse/slide-3.jpg",
      "/images/projects/innerverse/slide-4.jpg",
    ],
    year: "2025–present",
  },
  {
    slug: "qubio",
    title: "Qubio Ecosystem",
    tagline: "QR and NFC digital identity: content stacks you share as updatable QR codes.",
    description:
      "Cross-platform QR and NFC digital identity product for Qubio Global, delivered over 18 months at StackUp Solutions. Users build content stacks of video, audio, images and links and share them as updatable QR codes. I led the frontend and payments.",
    summary: {
      problem: "Physical QR and NFC tags needed digital pages that owners can edit from a phone, with a dashboard and paid plans behind them.",
      action:
        "Led the React Native app, the Next.js web dashboard (D3.js analytics, Redux Toolkit, RTK Query) and RevenueCat subscriptions, with a team of two and daily scrums with the Australian team.",
      result: "Delivered across mobile, web and subscriptions for Qubio Global over an 18-month engagement.",
    },
    category: "Full-Stack",
    stack: ["React Native", "Next.js", "D3.js", "Redux Toolkit", "RTK Query", "RevenueCat", "NFC / QR"],
    metrics: [
      "18 months for Qubio Global",
      "Led a team of two",
      "App, web dashboard and subscriptions",
    ],
    status: "Completed",
    featured: true,
    links: {
      web: "https://pages.qubio.me/",
    },
    images: [
      "/images/projects/qubio/hero.jpg",
      "/images/projects/qubio/detail-1.jpg",
      "/images/projects/qubio/detail-2.jpg",
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
    ],
    icon: "/images/projects/realtag/icon-256.png",
    year: "2026",
  },
  {
    slug: "kitty-nip",
    title: "Kitty Nip",
    tagline: "A cat dating app: swipe, match, chat. Taken over and kept running on current Android.",
    description:
      "Cat dating app on Android and iOS with 10K+ downloads on Google Play. The app predates my work. As lead engineer I took over the whole product, backend included, when the previous team left: fixed crashes on newer Android devices, sign-in, subscriptions and receipt validation.",
    summary: {
      problem: "A live app was crashing on newer Android devices after native platform changes, and the team that built it had left.",
      action:
        "Took over the product and backend. Upgraded React Native to 0.79 and its libraries onto the New Architecture, added 16 KB page-size support, converted class components to functional, shipped Google, Apple and phone sign-in, and added Play receipt validation in a Cloud Function.",
      result: "The app now reports 100% crash-free on Crashlytics, with 10K+ downloads on Google Play and a live App Store listing.",
    },
    category: "Mobile",
    stack: ["React Native 0.79", "New Architecture", "Firebase", "Cloud Functions", "In-app purchases", "Google Vision"],
    metrics: [
      "10K+ downloads on Google Play",
      "100% crash-free after the 0.79 upgrade",
      "Full ownership, backend included",
    ],
    status: "Live",
    featured: true,
    links: {
      playStore: "https://play.google.com/store/apps/details?id=computer.star.kittynip",
      appStore: "https://apps.apple.com/us/app/kitty-nip-cat-dating-app/id1520805359",
    },
    images: [
      "/images/projects/kitty-nip/hero.jpg",
      "/images/projects/kitty-nip/slide-1.jpg",
      "/images/projects/kitty-nip/slide-2.jpg",
      "/images/projects/kitty-nip/slide-3.jpg",
      "/images/projects/kitty-nip/slide-4.jpg",
      "/images/projects/kitty-nip/slide-5.jpg",
    ],
    year: "2023–present",
  },
  {
    slug: "cpas-huddle-up",
    title: "CPAS Huddle Up",
    tagline: "Sports coaching rooms with live podcasts over Agora.",
    description:
      "React Native frontend for a client coaching community: discover and join sport rooms, post film and drills, and go live for film review podcasts via Agora. Built for a previous company client — shipped live in 2023, product since sunset.",
    category: "Mobile",
    stack: ["React Native", "Agora", "Livestream"],
    metrics: [
      "Rooms + social feed",
      "Agora live podcasts",
      "Shipped client product (2023)",
    ],
    status: "Completed",
    featured: false,
    links: {},
    images: [
      "/images/projects/cpas-huddle-up/hero.jpg",
    ],
    year: "2023",
  },
  {
    slug: "meet-and-greet",
    title: "Meet & Greet",
    tagline: "1:1 and group video/voice calling with WebRTC.",
    description:
      "React Native calling product: online presence, dial-by-ID, 1:1 and group video/voice over WebRTC, with Socket.io signaling on Node.js designed for real mobile networks — not studio Wi-Fi.",
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
    ],
    year: "2023",
  },
  {
    slug: "bugmapper",
    title: "BugMapper",
    tagline: "Offline-first field app for counting insect traps in commercial greenhouses.",
    description:
      "Precision pest management platform for commercial greenhouses, deployed in Kayseri, Türkiye and covered in the agricultural trade press. As a contract engineer since 2023 I built the React Native field app: trap list, QR scanner, offline sync and cloud upload.",
    summary: {
      problem: "Workers count insect traps across large greenhouses, by hand and often without a connection.",
      action:
        "Built the Expo field app: scan a trap's QR code to open its record, log counts and chemical applications, queue everything in SQLite offline and sync when back online. Encrypted file transfer to an on-site device, English and Turkish.",
      result: "In production. The client reports a trap now takes about 10 seconds to record, against 5 to 10 minutes for manual counts.",
    },
    category: "Mobile",
    stack: ["React Native", "Expo", "TypeScript", "SQLite", "Zustand", "i18next"],
    metrics: [
      "About 10 sec per trap, vs 5–10 min by hand",
      "Works offline, syncs when back online",
      "In production in Kayseri, Türkiye",
    ],
    status: "Live",
    featured: true,
    links: {
      web: "https://www.bugmapper.com.tr/",
    },
    images: [
      "/images/projects/bugmapper/hero.jpg",
      "/images/projects/bugmapper/slide-1.jpg",
      "/images/projects/bugmapper/slide-2.jpg",
      "/images/projects/bugmapper/slide-3.jpg",
      "/images/projects/bugmapper/slide-4.jpg",
      "/images/projects/bugmapper/slide-5.jpg",
    ],
    year: "2023–present",
  },
  {
    slug: "safedeal",
    title: "SafeDeal",
    tagline: "Shop eBay, Amazon and AliExpress in one app, with a green, yellow or red verdict on every product.",
    description:
      "Shopping app where marketplace pages load in the app and a verdict bar rates the product on screen. Live on Google Play with 5,000+ downloads. I contributed to the Expo / React Native app, mainly the in-app browser, state and data fetching.",
    summary: {
      problem: "Buying from marketplaces means guessing which product and which shop to trust.",
      action:
        "Contributed to the React Native app: moved state from Redux and Context to Zustand, reworked data fetching with React Query, and made in-app browsing stable with a redirect-loop guard and injected scripts that hide promo banners.",
      result: "Live on Google Play with 5,000+ downloads.",
    },
    category: "Mobile",
    stack: ["React Native", "Expo", "WebView", "Zustand", "React Query"],
    metrics: [
      "5,000+ downloads on Google Play",
      "Contributor: browser, state and data",
      "Redux to Zustand, React Query",
    ],
    status: "Live",
    featured: true,
    links: {
      web: "https://www.joinsafedeal.com/",
      playStore: "https://play.google.com/store/apps/details?id=com.safedeal.navigator&pli=1",
    },
    images: [
      "/images/projects/safedeal/hero.jpg",
      "/images/projects/safedeal/slide-1.jpg",
      "/images/projects/safedeal/slide-2.jpg",
      "/images/projects/safedeal/slide-3.jpg",
      "/images/projects/safedeal/slide-4.jpg",
      "/images/projects/safedeal/slide-5.jpg",
    ],
    year: "2023–present",
  },
  {
    slug: "bschedule",
    title: "BSchedule",
    tagline: "Staff and customer booking apps on one scheduling API.",
    description:
      "Two React Native apps, staff and customer, sharing one Laravel backend with centralised scheduling and payment logic: appointments and tasks on a calendar timeline, staff assignment, push notifications and in-app purchases for premium features. Built at StackUp Solutions.",
    category: "Mobile",
    stack: ["React Native", "Laravel", "MySQL", "Redux", "SQLite", "In-app purchases"],
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
      "/images/projects/bschedule/hero.jpg",
      "/images/projects/bschedule/slide-1.jpg",
      "/images/projects/bschedule/slide-2.jpg",
      "/images/projects/bschedule/slide-3.jpg",
      "/images/projects/bschedule/slide-4.jpg",
      "/images/projects/bschedule/slide-5.jpg",
      "/images/projects/bschedule/slide-6.jpg",
      "/images/projects/bschedule/slide-7.jpg",
    ],
    year: "2021–2022",
  },
  {
    slug: "snapwork",
    title: "Snapwork",
    tagline: "Creator campaigns, payments, and social-account workflows for brands.",
    description:
      "React Native mobile + React web for a two-sided creator marketplace: onboarding with social platform connect, campaign listings, brand dashboards, portfolios, and MangoPay-backed payments. I worked on the frontend plus social API data pulls and payments integrations. Built 2022–2023; product since sunset.",
    category: "Full-Stack",
    stack: ["React Native", "React", "MangoPay", "Facebook API", "TikTok API"],
    metrics: [
      "Social platform connect + data pulls",
      "Campaign + applicant workflows",
      "Payments / receipt surfaces",
    ],
    status: "Completed",
    featured: false,
    links: {},
    images: [
      "/images/projects/snapwork/hero.jpg",
    ],
    icon: "/images/projects/snapwork/icon.png",
    year: "2022–2023",
  },
  {
    slug: "sextherapypro",
    title: "TherapyPro",
    tagline: "AI sexual wellness — personalized plans, Eros chat, guided exercises.",
    description:
      "Expo / React Native app for an AI sexual-wellness companion, built at StackUp Solutions. I built the RevenueCat subscription flow and the in-app AI chat on AWS Bedrock, alongside daily personalised plans and guided couple exercises.",
    category: "AI",
    stack: ["React Native", "Expo", "TypeScript", "AWS Bedrock", "RevenueCat"],
    metrics: [
      "AI therapist chat (Eros)",
      "Daily personalized plans",
      "Guided exercises + couple games",
    ],
    status: "Completed",
    featured: false,
    links: {},
    images: [
      "/images/projects/sextherapypro/hero.jpg",
    ],
    year: "2025",
  },
  {
    slug: "catchat",
    title: "CatChat",
    tagline: "AI cat companions — generated characters, in-character chat, PWA.",
    description:
      "AI companion web app I built at Star Computer Labs: a Next.js PWA for browsing generated cats and chatting in character, with Anthropic Claude for chat and Stability AI for image generation on Firebase.",
    category: "AI",
    stack: ["Next.js", "Firebase", "Cloud Functions", "Claude API", "Stability AI"],
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
    ],
    year: "2023–present",
  },
  {
    slug: "dealflow-ai",
    title: "Dealflow AI",
    tagline: "AI-native CRM for freelancers — deals, tasks, and follow-ups in one place.",
    description:
      "Personal product: Next.js web + Expo mobile sharing a Supabase backend. Pipeline for clients and deals, activity timeline, and AI that summarizes deals, extracts next actions, and drafts follow-ups.",
    summary: {
      problem:
        "Freelancer CRM tools are either too generic or too heavy — deals, tasks, and follow-ups scatter across notes and inboxes.",
      action:
        "Building Next.js + Expo on one Supabase backend: pipeline, timeline, and AI summarize → approve → tasks.",
      result: "In development as a personal Jafrix product with a shared typed monorepo.",
    },
    category: "AI",
    stack: ["Next.js", "Expo", "Supabase", "OpenAI / OpenRouter", "TypeScript"],
    metrics: [
      "Web + mobile, one backend",
      "AI summary → approve → tasks",
      "Shared typed monorepo",
    ],
    status: "In Development",
    featured: false,
    links: {},
    images: [
      "/images/projects/dealflow-ai/hero.jpg",
    ],
    year: "2026",
  },
  {
    slug: "decidr",
    title: "Decidr",
    tagline: "Turn messy dilemmas into weighted, explainable decisions.",
    description:
      "Personal project, deployed publicly during development: paste a dilemma or walk a wizard, and options, criteria and weights become a scored matrix with ranking and an AI reasoning trace. What-if weight simulation and side-by-side compare on Next.js, Supabase and OpenRouter.",
    category: "AI",
    stack: ["Next.js", "TypeScript", "Supabase", "OpenRouter"],
    metrics: [
      "Weighted option × criteria matrices",
      "Explainable AI scoring + what-if",
      "Personal project, public prototype",
    ],
    status: "In Development",
    featured: false,
    links: {
      github: "https://github.com/QasimJaffry/Decidr",
      web: "https://decidr-henna.vercel.app/",
    },
    images: [
      "/images/projects/decidr/hero.jpg",
    ],
    year: "2026",
  },
  {
    slug: "interio",
    title: "Interior Assistant (Interio)",
    tagline: "Scan a room, detect furniture, place pieces in AR — before you buy.",
    description:
      "Started in 2019 as my final-year project, Interior Assistant, on React Native 0.62 with a custom TensorFlow Lite model and Viro AR. Rebuilt in 2026 as Interio on Expo SDK 53 and React Native 0.79, with on-device ML Kit detection, ViroReact true-scale AR placement, Expo Router and Zustand. Firebase handles auth, favourites and the catalogue.",
    category: "Mobile",
    stack: ["React Native", "Expo", "ViroReact", "ML Kit", "TensorFlow Lite", "Firebase"],
    metrics: [
      "2019: RN 0.62, TensorFlow Lite",
      "2026 rebuild: Expo 53, RN 0.79, ML Kit",
      "True-scale AR placement",
    ],
    status: "Completed",
    featured: false,
    links: {
      github: "https://github.com/QasimJaffry/InteriorDesign",
    },
    images: [
      "/images/projects/interio/hero.jpg",
    ],
    year: "2019–present",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Homepage featured set — strongest outcomes first. */
const FEATURED_ORDER = [
  "agenticly",
  "kitty-nip",
  "innerverse",
  "bugmapper",
  "safedeal",
  "qubio",
] as const;

export function getFeaturedProjects(): Project[] {
  return FEATURED_ORDER.map((slug) => projects.find((p) => p.slug === slug)).filter(
    (p): p is Project => Boolean(p?.featured),
  );
}
