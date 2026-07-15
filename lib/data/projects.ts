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
  year: string;
};

export const projects: Project[] = [
  {
    slug: "agenticly",
    title: "Agenticly",
    tagline: "AI crypto research assistant. Live on Play Store and web.",
    description:
      "Full ownership product — React Native app, Next.js web app, Firebase, RevenueCat (mobile subscriptions), Stripe (web payments). Built and shipped solo.",
    category: "AI",
    stack: ["React Native", "Next.js", "Firebase", "RevenueCat", "Stripe", "OpenAI API"],
    metrics: ["Live on Play Store", "Mobile + web subscription revenue", "Built and shipped solo"],
    status: "Live",
    featured: true,
    links: {
      // TODO: Add Play Store link for Agenticly
      playStore: undefined,
      // TODO: Add web link for Agenticly
      web: undefined,
    },
    images: [],
    year: "2024",
  },
  {
    slug: "innerverse",
    title: "Innerverse",
    tagline: "AI mood tracking app with personal cosmos visualization.",
    description:
      "Solo founder product, live on Play Store under Jafrix Systems. Built in React Native + Expo + Skia. Features an AI guide called Nova and a unique cosmos metaphor for mood visualization.",
    category: "Mobile",
    stack: ["React Native", "Expo", "Skia", "Firebase", "OpenAI API"],
    // TODO: Confirm Innerverse download count
    metrics: ["Live on Play Store", "Growing organic downloads", "Built and published solo"],
    status: "Live",
    featured: true,
    links: {
      playStore: "https://play.google.com/store/apps/details?id=innerverse.app",
    },
    images: [
      "/images/projects/innerverse/hero.jpg",
      "/images/projects/innerverse/detail-1.jpg",
      "/images/projects/innerverse/detail-2.jpg",
    ],
    year: "2024",
  },
  {
    slug: "qubio",
    title: "Qubio Ecosystem",
    tagline: "Cross-platform QR/NFC digital identity system.",
    description:
      "React Native + Next.js product with D3.js analytics dashboard. 18-month engagement with a distributed remote team. International client deployment.",
    category: "Full-Stack",
    stack: ["React Native", "Next.js", "D3.js", "PostgreSQL", "GraphQL"],
    metrics: ["18-month engagement", "Distributed remote team", "International client"],
    status: "Completed",
    featured: true,
    links: {},
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
    tagline: "Live camera object detection and re-identification.",
    description:
      "Production ML pipeline using YOLO11, SAM2, and DINOv2 for real-world object detection and re-identification in a live camera feed. React Native client.",
    category: "AI",
    stack: ["React Native", "YOLO11", "SAM2", "DINOv2", "Python", "FastAPI"],
    metrics: ["Production ML pipeline", "Real-time inference", "Custom model integration"],
    status: "Completed",
    featured: false,
    links: {},
    images: [],
    year: "2024",
  },
  {
    slug: "kitty-nip",
    title: "Kitty Nip",
    tagline: "Location-based social app. 10,000+ Play Store downloads.",
    description:
      "Took over full product ownership including backend. Scaled and maintained the product through 10,000+ downloads.",
    category: "Mobile",
    stack: ["React Native", "Node.js", "PostgreSQL", "Firebase"],
    metrics: ["10,000+ Play Store downloads", "Full product ownership", "Backend included"],
    status: "Live",
    featured: false,
    links: {},
    images: [],
    year: "2023",
  },
  {
    slug: "meet-and-greet",
    title: "Meet & Greet",
    tagline: "Native video and voice calling app with WebRTC.",
    description:
      "1:1 and group calling support using WebRTC and Agora. Built for production with real-time communication architecture.",
    category: "Full-Stack",
    stack: ["React Native", "WebRTC", "Agora", "Socket.io", "Node.js"],
    metrics: ["1:1 and group calls", "Production WebRTC", "Real-time signaling"],
    status: "Completed",
    featured: false,
    links: {},
    images: [],
    year: "2023",
  },
  {
    slug: "bugmapper",
    title: "BugMapper",
    tagline: "Real-time greenhouse analytics with disease tracking.",
    description:
      "International agri-tech client. Real-time dashboards for greenhouse disease tracking and analytics.",
    category: "Web",
    stack: ["React.js", "Node.js", "PostgreSQL", "WebSockets", "D3.js"],
    metrics: ["International agri-tech client", "Real-time dashboards", "Disease tracking system"],
    status: "Completed",
    featured: false,
    links: {},
    images: [
      "/images/projects/bugmapper/hero.png",
      "/images/projects/bugmapper/detail-1.png",
      "/images/projects/bugmapper/detail-2.png",
    ],
    year: "2023",
  },
  {
    slug: "bschedule",
    title: "BSchedule",
    tagline: "Staff and customer scheduling apps backed by a single API.",
    description:
      "Two React Native apps (staff-facing and customer-facing) built on a single Laravel API. Full scheduling system for a business client.",
    category: "Mobile",
    stack: ["React Native", "Laravel", "MySQL", "REST API"],
    metrics: ["Two apps, one API", "Staff + customer portals", "Production scheduling system"],
    status: "Completed",
    featured: false,
    links: {},
    images: [
      "/images/projects/bschedule/hero.png",
      "/images/projects/bschedule/detail-1.png",
      "/images/projects/bschedule/detail-2.png",
    ],
    year: "2022",
  },
  {
    slug: "catchat",
    title: "CatChat",
    tagline: "AI companion web app. Built solo on Next.js and Firebase.",
    description:
      "Solo-built AI companion app using Next.js, Firebase, and OpenAI. Full product ownership from design to deployment.",
    category: "AI",
    stack: ["Next.js", "Firebase", "OpenAI API", "TypeScript"],
    metrics: ["Built solo", "Full product ownership", "AI companion UX"],
    status: "Completed",
    featured: false,
    links: {},
    images: [],
    year: "2023",
  },
  {
    slug: "dealflow-ai",
    title: "Dealflow AI",
    tagline: "AI-powered CRM for freelancers.",
    description:
      "Personal project. AI-powered CRM built on Next.js, Expo, Supabase, and OpenAI. Designed for freelancers to manage leads, proposals, and deals.",
    category: "AI",
    stack: ["Next.js", "Expo", "Supabase", "OpenAI API", "TypeScript"],
    metrics: ["Personal project", "Mobile + web", "AI-native CRM"],
    status: "In Development",
    featured: false,
    links: {},
    images: [
      "/images/projects/dealflow-ai/hero.jpg",
      "/images/projects/dealflow-ai/detail-1.jpg",
      "/images/projects/dealflow-ai/detail-2.jpg",
      "/images/projects/dealflow-ai/detail-3.jpg",
    ],
    year: "2024",
  },
  {
    slug: "decidr",
    title: "Decidr",
    tagline: "AI decision intelligence SaaS.",
    description:
      "Personal project. AI-powered decision intelligence platform built on Next.js, TypeScript, Supabase, Stripe, and OpenRouter.",
    category: "AI",
    stack: ["Next.js", "TypeScript", "Supabase", "Stripe", "OpenRouter"],
    metrics: ["Personal SaaS project", "Stripe payments", "OpenRouter multi-model"],
    status: "In Development",
    featured: false,
    links: {},
    images: [],
    year: "2024",
  },
  {
    slug: "interio",
    title: "Interio",
    tagline: "Scan a room, detect furniture, place pieces in AR.",
    description:
      "React Native AR interior app — on-device ML Kit furniture detection, ViroReact real-scale placement, and a Firebase-backed catalogue with favourites.",
    category: "Mobile",
    stack: ["React Native", "Expo", "ViroReact", "ML Kit", "Firebase"],
    metrics: ["On-device furniture detection", "True-scale AR placement", "Scan → suggest → AR flow"],
    status: "Completed",
    featured: false,
    links: {},
    images: [
      "/images/projects/interio/hero.jpg",
      "/images/projects/interio/detail-1.jpg",
      "/images/projects/interio/detail-2.jpg",
    ],
    year: "2023",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}
