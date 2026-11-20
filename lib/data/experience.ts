export type ExperienceEntry = {
  company: string;
  role: string;
  type: string;
  location: string;
  period: string;
  /** One-line scope for the timeline */
  description: string;
  /** Resume bullets. Facts, titles and dates match the CV (Portfolio Kit, Nov 2026). */
  bullets: string[];
  stack: string[];
};

export const experience: ExperienceEntry[] = [
  {
    company: "Star Computer Labs",
    role: "Senior Full-Stack Engineer",
    type: "Full-time since May 2025; part-time Jan 2021 – Apr 2025",
    location: "Remote · California, United States",
    period: "Jan 2021 – Present",
    description:
      "Lead engineer on three live products for a US team: Agenticly end to end, Kitty Nip after the previous team left, and AI Maker Pro (100K+ downloads). Part-time from 2021 alongside StackUp, full-time since May 2025.",
    bullets: [
      "Agenticly: AI crypto and stock research assistant on Google Play, the App Store and web. 26K installs across web, Android and iOS combined, about 2.3K monthly active users, typically 100% crash-free on Firebase Crashlytics.",
      "Led the engineering on this team product. Built and own the React Native app, the Next.js web client, Firebase infrastructure and Functions, and the scheduled-agents feature.",
      "Own the payments layer: RevenueCat on mobile and Stripe on web, writing one subscription record that decides who can run an agent.",
      "Kitty Nip: took over full ownership of a live location-based social app (10K+ Google Play downloads, App Store), including its backend, when the previous team left.",
      "Fixed crashes on newer Android devices: upgraded React Native to 0.79 and its libraries onto the New Architecture (Fabric and TurboModules), added Android 16 KB page-size support and moved class components to functional ones. The app now reports 99.9%+ crash-free users on Crashlytics.",
      "Shipped Google, Apple and phone sign-in, reworked subscription plans with restore purchase, and added a Cloud Function that validates Android receipts against the Play Developer API.",
      "AI Maker Pro: took over a Flutter app with 100K+ downloads on Google Play and have owned every production release for about 1.5 years.",
      "Part-time (2021 to 2025): joined the Kitty Nip (from Oct 2023) and Agenticly (from 2024) teams, and built CatChat, a Next.js AI companion web app with Anthropic Claude for chat and Stability AI for images.",
    ],
    stack: ["React Native", "Expo", "Next.js", "TypeScript", "Firebase", "Cloud Functions", "Stripe", "RevenueCat"],
  },
  {
    company: "BugMapper and Jafrix Systems",
    role: "Contract Engineer; Founder of Jafrix Systems",
    type: "Contract, run through my studio Jafrix Systems since Jun 2025",
    location: "Remote · Türkiye and Lahore, Pakistan",
    period: "Sep 2023 – Present",
    description:
      "Contract work alongside my main role. BugMapper since 2023: the offline-first field app greenhouse staff use to record trap counts, now about 10 seconds a trap against 5 to 10 minutes by hand. Since 2025 this runs through Jafrix Systems, my studio, where I also built Innerverse.",
    bullets: [
      "BugMapper: built the React Native (Expo) field app that staff use to scan trap and location QR codes and record trap counts, plant observations and chemical applications. The client reports a trap now takes about 10 seconds, against 5 to 10 minutes for manual counts.",
      "Implemented offline operation: deployments and photos are stored in a local SQLite queue and synchronised when connectivity returns, with a view of pending items.",
      "Developed encrypted file transfer between the mobile app and an on-site device, with integrity checks and a mock server for hardware-free testing.",
      "Built validated chemical-entry forms and drawer navigation with English and Turkish localisation, and contributed to the admin web dashboard.",
      "Innerverse: designed, built and published a mood journal for Android, live on Google Play.",
      "Built with Expo and React Native on the New Architecture, with Skia and Reanimated, Zustand state and Firebase (Auth, Firestore, Storage, Functions).",
      "Implemented RevenueCat subscriptions with server-owned entitlements: a webhook reducer covered by automated tests, plus Firestore security-rules tests.",
      "Kept journal text private by design: no entry text is sent to any AI service in the shipped app.",
    ],
    stack: ["React Native", "Expo", "TypeScript", "SQLite", "Zustand", "Skia", "Firebase", "RevenueCat"],
  },


  {
    company: "StackUp Solutions",
    role: "Senior Software Engineer and Tech Lead",
    type: "Full-time",
    location: "Pakistan",
    period: "Feb 2021 – May 2025",
    description:
      "Led teams of up to nine across client products on Android, iOS and web, hands-on in the code, from kickoff to delivery.",
    bullets: [
      "Led and managed teams of up to 9 people (4 to 5 on average), including junior developers, and set team standards for architecture and code review.",
      "Shipped client products including Blackpin Business (led architecture and delivery with a team of 4), CPAS Huddle Up, Snapwork, Zitro Workplace, Yam Rewards and Schedular Pro.",
      "Qubio Ecosystem: delivered a cross-platform QR and NFC digital identity product for Qubio Global over 18 months, leading the React Native app, the Next.js dashboard and RevenueCat subscriptions.",
      "TherapyPro: built the RevenueCat subscription flow and the in-app AI chat on AWS Bedrock.",
      "Meet & Greet: native video and voice calling with one-to-one and group WebRTC, tuned for mid-range devices and poor connections.",
      "Mentored junior developers and conducted technical interviews.",
    ],
    stack: ["React Native", "Next.js", "Laravel", "MongoDB", "WebRTC", "D3.js", "Redux Toolkit", "RevenueCat"],
  },

];
