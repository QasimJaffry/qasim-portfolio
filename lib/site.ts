/** Central site config — update calendlyUrl when you have a booking link. */
export const site = {
  name: "Qasim Hassan",
  title: "Senior Full-Stack Engineer",
  positioning: "React Native, Next.js, and AI products that ship to real users.",
  email: "qhassan1214@gmail.com",
  location: "Lahore, Pakistan",
  relocation: "Open to relocation (Germany · Canada · UAE)",
  url: "https://qasimhassan.dev",
  /** Set to your Calendly/Cal.com URL to enable “Book a call” CTAs. */
  calendlyUrl: null as string | null,
  replySla: "I respond within 24 hours.",
  availability: {
    status: "Open to freelance, consulting, and senior remote roles",
    currentlyBuilding: ["Dealflow AI", "Decidr", "Innerverse updates"],
  },
  social: {
    github: "https://github.com/QasimJaffry",
    linkedin: "https://linkedin.com/in/qasim-hassan-02871a171",
    upwork: "https://www.upwork.com/freelancers/~011828438344ce4299",
  },
} as const;

export function mailtoHref(subject?: string) {
  const q = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${site.email}${q}`;
}
