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
  /** Listed compactly under "More projects" on /work instead of as a card. */
  more?: boolean;
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
        "Designed and built it solo: a Skia galaxy where each entry becomes a world, a logging flow where you pick a mood, set its intensity and tag it, month star charts and time-of-day patterns, and RevenueCat subscriptions with server-owned entitlements.",
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
    links: {},
    images: [
      "/images/projects/qubio/hero.jpg",
      "/images/projects/qubio/detail-1.jpg",
      "/images/projects/qubio/detail-2.jpg",
      "/images/projects/qubio/slide-1.jpg",
    ],
    year: "2023–2025",
  },
  {
    slug: "realtag",
    title: "RealTag",
    tagline: "Tag any object in a live camera feed and find it again later.",
    description:
      "Object tagging app: an Expo app with Vision Camera talks to a FastAPI server on the same Wi-Fi. YOLO11 finds objects, SAM2 cuts them out (automatically or where you tap), and DINOv2 embeddings let the app recognise the same object again across frames, angles and lighting. Tags are stored on the phone.",
    summary: {
      problem: "Detecting an object in one frame is easy. Recognising the same object later, from another angle, and keeping your own label on it is not.",
      action:
        "Built an Expo app with Vision Camera, Skia overlays and MMKV storage, and a FastAPI server that runs YOLO11 for detection, SAM2 for masks and DINOv2 for embeddings, matched by similarity.",
      result: "Runs end to end: tag an object once and the app finds it again in later frames.",
    },
    category: "AI",
    stack: ["Expo", "React Native", "Vision Camera", "Skia", "MMKV", "FastAPI", "YOLO11", "SAM2", "DINOv2"],
    metrics: [
      "Detect, segment and embed",
      "Tap-to-segment and automatic masks",
      "Finds a tagged object again by embedding",
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
      result: "The app now reports 99.9%+ crash-free users on Crashlytics, with 10K+ downloads on Google Play and a live App Store listing.",
    },
    category: "Mobile",
    stack: ["React Native 0.79", "New Architecture", "Firebase", "Cloud Functions", "In-app purchases", "Google Vision"],
    metrics: [
      "10K+ downloads on Google Play",
      "99.9%+ crash-free users after the 0.79 upgrade",
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
    slug: "ai-maker-pro",
    title: "AI Maker Pro",
    tagline: "An AI image and video generation app. Taken over, and every production release owned since.",
    description:
      "Flutter app for AI image and video generation with 100K+ downloads on Google Play. The app predates my work. At Star Computer Labs I took it over and have owned every production release for about 1.5 years: feature work, bug fixes and store submissions, using AI-assisted development.",
    summary: {
      problem: "A live Flutter app built by many developers over several years needed one owner for production releases as App Store and Google Play rules kept changing.",
      action:
        "Took over releases. Fixed App Store rejections (a tracking prompt that never showed, GDPR consent order, privacy manifests), upgraded RevenueCat for Play Billing 8, and added fail-closed Google Vision SafeSearch moderation on image uploads.",
      result: "100K+ downloads on Google Play, with every production release shipped by me for about 1.5 years.",
    },
    category: "Mobile",
    stack: ["Flutter", "Dart", "BLoC", "Firebase", "RevenueCat", "Python", "Google Cloud", "Google Vision"],
    metrics: [
      "100K+ downloads on Google Play",
      "Every production release for about 1.5 years",
      "Taken over from a multi-developer codebase",
    ],
    status: "Live",
    featured: false,
    links: {
      playStore: "https://play.google.com/store/apps/details?id=com.starcomputer.aimaker",
    },
    images: ["/images/projects/ai-maker-pro/hero.jpg"],
    icon: "/images/projects/ai-maker-pro/icon.png",
    year: "2025–present",
  },
  {
    slug: "cpas-huddle-up",
    more: true,
    title: "CPAS Huddle Up",
    tagline: "Sports coaching rooms with live podcasts over Agora.",
    description:
      "React Native app for a sports coaching community, built for a client at StackUp Solutions. Coaches and athletes find and join rooms by sport, post film and drills, and go live for film-review podcasts over Agora. It shipped in 2023 and has since been taken offline.",
    summary: {
      problem: "Coaches wanted one app for their team: film review, drills and pre-game talk, plus a way to go live.",
      action:
        "Built the React Native frontend: room discovery and joining, an in-room feed of posts and comments, and live audio sessions over Agora with a comment thread.",
      result: "Shipped to the client in 2023. The product has since been taken offline.",
    },
    category: "Mobile",
    stack: ["React Native", "Agora", "Livestream"],
    metrics: [
      "Rooms and social feed",
      "Live podcasts over Agora",
      "Shipped client product (2023)",
    ],
    status: "Completed",
    featured: false,
    links: {},
    images: [
      "/images/projects/cpas-huddle-up/hero.jpg",
      "/images/projects/cpas-huddle-up/slide-1.jpg",
      "/images/projects/cpas-huddle-up/slide-2.jpg",
    ],
    year: "2023",
  },
  {
    slug: "blackpin-business",
    more: true,
    title: "Blackpin Business",
    tagline: "Find local businesses by category, buy their discount vouchers and pay in the app.",
    description:
      "Client app built at StackUp Solutions, where I led the architecture and delivery with a team of four. Users browse local businesses by category on a map or a grid, open a business profile, buy discount vouchers and pay by card. Business owners sign in with their own role.",
    summary: {
      problem: "Local businesses needed one place to be found by category and to sell discount vouchers to nearby customers.",
      action:
        "Led the architecture and delivery with a team of four: category browsing on a map and a grid, business profiles with vouchers, reviews and location, card checkout with saved cards, and separate sign-in for business owners and users.",
      result: "Delivered to the client as a mobile app for business owners and their customers.",
    },
    category: "Mobile",
    stack: ["React Native", "Maps", "Card payments"],
    metrics: [
      "Led architecture and delivery",
      "Team of four",
      "Vouchers, map search and checkout",
    ],
    status: "Completed",
    featured: false,
    links: {},
    images: [
      "/images/projects/blackpin-business/hero.jpg",
      "/images/projects/blackpin-business/slide-1.jpg",
      "/images/projects/blackpin-business/slide-2.jpg",
      "/images/projects/blackpin-business/slide-3.jpg",
    ],
    year: "2021–2025",
  },
  {
    slug: "zitro-workplace",
    more: true,
    title: "Zitro Workplace",
    tagline: "Home owners post jobs, contractors send proposals, and the two agree the work in chat.",
    description:
      "Two-sided jobs app for Zitro Services LLC, shipped at StackUp Solutions. Home owners post jobs with a category, location, date and time; contractors reply with a proposal, rate and visit time; the owner hires or chats with them first.",
    summary: {
      problem: "Home owners needed a simple way to post small jobs and compare quotes from contractors.",
      action:
        "Built the client app around posted jobs and invites, active, proposal and past job lists, proposal details with rate and visit time, and one-to-one chat between owner and contractor.",
      result: "Shipped to the client as part of StackUp Solutions' client work.",
    },
    category: "Mobile",
    stack: ["React Native", "Chat", "Notifications"],
    metrics: [
      "Jobs, proposals and hiring",
      "Owner and contractor chat",
      "Shipped client product",
    ],
    status: "Completed",
    featured: false,
    links: {},
    images: [
      "/images/projects/zitro-workplace/hero.jpg",
      "/images/projects/zitro-workplace/slide-1.jpg",
      "/images/projects/zitro-workplace/slide-2.jpg",
    ],
    year: "2021–2025",
  },
  {
    slug: "yam-rewards",
    more: true,
    title: "Yam Rewards",
    tagline: "Brand sales and bank card discounts in one app, so shoppers see every offer before they buy.",
    description:
      "Deals app for shoppers in Pakistan, shipped at StackUp Solutions. It gathers clothing and food brand sales into one feed and lists the discounts each bank's debit and credit cards unlock, with the days and stores where each offer applies.",
    summary: {
      problem: "Brand sales and bank card discounts are spread across many apps and adverts, so shoppers miss offers they already qualify for.",
      action:
        "Built the client app: onboarding, a home feed of brand sales by category, a bank list, and offer pages showing each card's discount, the days and stores it applies to, and its terms.",
      result: "Shipped to the client as part of StackUp Solutions' client work.",
    },
    category: "Mobile",
    stack: ["React Native"],
    metrics: [
      "Brand sales by category",
      "Discounts by bank card",
      "Shipped client product",
    ],
    status: "Completed",
    featured: false,
    links: {},
    images: [
      "/images/projects/yam-rewards/hero.jpg",
      "/images/projects/yam-rewards/slide-1.jpg",
      "/images/projects/yam-rewards/slide-2.jpg",
    ],
    year: "2021–2025",
  },
  {
    slug: "meet-and-greet",
    more: true,
    title: "Meet & Greet",
    tagline: "One-to-one and group video and voice calls over WebRTC.",
    description:
      "React Native video and voice calling app built at StackUp Solutions: see who is online, call by ID, and hold one-to-one or group calls over WebRTC, with Socket.IO signalling on Node.js. Tuned for mid-range phones and poor connections.",
    category: "Full-Stack",
    stack: ["React Native", "WebRTC", "Socket.IO", "Node.js"],
    metrics: [
      "One-to-one and group calls",
      "Tuned for mid-range phones",
      "Built for poor connections",
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
      "About 10 s per trap, against 5 to 10 min by hand (client figure)",
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
    stack: ["React Native", "Expo", "TypeScript", "WebView", "Zustand", "React Query"],
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
    year: "2024",
  },
  {
    slug: "bschedule",
    title: "BSchedule",
    tagline: "Staff and customer booking apps on one scheduling API.",
    description:
      "Two React Native apps, staff and customer, sharing one Laravel backend with centralised scheduling and payment logic: appointments and tasks on a calendar timeline, staff assignment, push notifications and in-app purchases for premium features. Built at StackUp Solutions. Shipped on iOS and Android; the apps are no longer in the stores.",
    summary: {
      problem: "A business needed one schedule for two audiences: staff running jobs and customers booking them.",
      action:
        "Built the staff and customer React Native apps on one Laravel backend, and led the in-app purchases for premium customisation and the OneSignal alerts that tell staff when a job is assigned to them.",
      result: "Shipped on iOS and Android. The apps have since been taken out of the stores.",
    },
    category: "Mobile",
    stack: ["React Native", "Redux", "Laravel", "SQLite", "In-app purchases", "OneSignal"],
    metrics: [
      "Two apps, one API",
      "Staff and customer apps",
      "Shipped on iOS and Android",
    ],
    status: "Completed",
    featured: false,
    links: {},
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
    more: true,
    title: "Snapwork",
    tagline: "A marketplace where brands run campaigns and creators apply with their social accounts.",
    description:
      "Creator marketplace built at StackUp Solutions: a React Native app for creators and a React web app for brands, with social account linking, campaign listings, brand dashboards, portfolios and MangoPay payments. I worked on the frontend, the Facebook and TikTok API integrations and the payments. Built 2022 to 2023; the product is now offline.",
    summary: {
      problem: "Brands needed to see a creator's real follower and engagement numbers before paying them, and creators needed to get paid.",
      action:
        "Worked on the React Native and React frontends, pulled account data through the Facebook and TikTok APIs, and integrated MangoPay for payments.",
      result: "Shipped as a client product on mobile and web. It has since been taken offline.",
    },
    category: "Full-Stack",
    stack: ["React Native", "React", "MangoPay", "Facebook API", "TikTok API"],
    metrics: [
      "Social account linking and data",
      "Campaign and applicant flows",
      "MangoPay payments",
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
    more: true,
    title: "TherapyPro",
    tagline: "AI sexual wellness app with daily plans, a chat guide and guided exercises.",
    description:
      "Expo and React Native app for an AI sexual-wellness companion, built at StackUp Solutions. The app has daily personalised plans, guided couple exercises and an AI guide called Eros. I built the RevenueCat subscription flow and the in-app AI chat on AWS Bedrock.",
    category: "AI",
    stack: ["React Native", "Expo", "TypeScript", "AWS Bedrock", "RevenueCat"],
    metrics: [
      "AI chat on AWS Bedrock",
      "RevenueCat subscriptions",
      "Daily plans and couple exercises",
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
    more: true,
    title: "CatChat",
    tagline: "Chat with AI-generated cat characters that stay in character.",
    description:
      "AI companion web app I built at Star Computer Labs: a Next.js PWA where you browse generated cats and chat with them in character. Anthropic Claude handles the chat and Stability AI draws the portraits, on Firebase.",
    summary: {
      problem: "Most AI chat is a text box around a generic model, with no character and nothing to come back to.",
      action:
        "Built a Next.js PWA on Firebase Auth and Firestore, with Cloud Functions that generate each cat's profile and portrait and keep replies in character using the recent thread as context.",
      result: "Live as an installable web app on Firebase Hosting.",
    },
    category: "AI",
    stack: ["Next.js", "Firebase", "Cloud Functions", "Claude API", "Stability AI"],
    metrics: [
      "Generated cat profiles and portraits",
      "In-character chat",
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
    more: true,
    title: "Dealflow AI",
    tagline: "A CRM for freelancers: deals, tasks and follow-ups in one place, with AI help.",
    description:
      "Personal project: a Next.js web app and an Expo mobile app on one Supabase backend. Clients and deals in a pipeline, an activity timeline, and AI that summarises a deal, pulls out next actions and drafts follow-ups.",
    summary: {
      problem:
        "Freelancers keep deals, tasks and follow-ups across notes, inboxes and spreadsheets, and most CRMs are built for sales teams.",
      action:
        "Building a Next.js web app and an Expo app on one Supabase backend, in a typed monorepo. AI suggests a summary and next actions, and nothing becomes a task until you approve it.",
      result: "In development. The pipeline screens and the AI flow work; email and calendar sync are still to come.",
    },
    category: "AI",
    stack: ["Next.js", "Expo", "Supabase", "OpenAI / OpenRouter", "TypeScript"],
    metrics: [
      "Web and mobile, one backend",
      "AI suggests, you approve",
      "Shared typed monorepo",
    ],
    status: "In Development",
    featured: false,
    links: {
      github: "https://github.com/QasimJaffry/DealFlow",
    },
    images: [
      "/images/projects/dealflow-ai/hero.jpg",
      "/images/projects/dealflow-ai/slide-1.jpg",
      "/images/projects/dealflow-ai/slide-2.jpg",
      "/images/projects/dealflow-ai/slide-3.jpg",
      "/images/projects/dealflow-ai/slide-4.jpg",
    ],
    year: "2026",
  },
  {
    slug: "decidr",
    more: true,
    title: "Decidr",
    tagline: "Turn messy dilemmas into weighted, explainable decisions.",
    description:
      "Personal project, deployed publicly during development. Paste a dilemma or step through a short wizard, and the options, criteria and weights become a scored matrix with a ranking and an AI reasoning trace. You can change weights to see what changes and compare decisions side by side. Next.js, Supabase and OpenRouter.",
    summary: {
      problem: "Hard decisions stall when the trade-offs sit in chat threads and spreadsheets instead of one clear comparison.",
      action:
        "Built a Next.js app on Supabase that turns a dilemma into a weighted option and criteria matrix. OpenRouter extracts the options and criteria, scoring runs on the server, and weight changes recompute without another AI call.",
      result: "A personal prototype, deployed publicly during development, with the decision flow, charts and share links working.",
    },
    category: "AI",
    stack: ["Next.js", "TypeScript", "Supabase", "OpenRouter"],
    metrics: [
      "Weighted option × criteria matrices",
      "AI scoring with a reasoning trace",
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
    tagline: "Scan a room, detect furniture and place pieces in AR before you buy.",
    description:
      "Started in 2019 as my final-year project, Interior Assistant, on React Native 0.62 with a custom TensorFlow Lite model and Viro AR. Rebuilt in 2026 as Interio on Expo SDK 53 and React Native 0.79, with on-device ML Kit detection, ViroReact true-scale AR placement, Expo Router and Zustand. Firebase handles auth, favourites and the catalogue.",
    summary: {
      problem: "From a product photo you can't tell how a piece of furniture will fit the room you already have.",
      action:
        "Built it in 2019 as my final-year project on React Native 0.62 with a custom TensorFlow Lite model, then rebuilt it in 2026 on Expo SDK 53 and React Native 0.79: ML Kit detects furniture on the phone, and ViroReact places true-scale models in AR.",
      result: "One app across both versions: scan a room, get matching pieces, and place them in AR on a physical device.",
    },
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
      "/images/projects/interio/slide-1.jpg",
      "/images/projects/interio/slide-2.jpg",
      "/images/projects/interio/slide-3.jpg",
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
