import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist_Mono, Newsreader } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HideOnHome from "@/components/HideOnHome";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.title}`,
    template: `%s — ${site.name}`,
  },
  description:
    "Senior Full-Stack Engineer with 6+ years shipping mobile and web products. React Native, Next.js, AI integrations. Top Rated Plus on Upwork. Based in Lahore, Pakistan.",
  keywords: [
    "React Native developer",
    "Next.js engineer",
    "AI integration developer",
    "Full-stack engineer Pakistan",
    "mobile app developer Lahore",
    "senior developer Upwork",
    "Expo developer",
    "RevenueCat Stripe",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    title: `${site.name} — ${site.title}`,
    description: site.positioning,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.title}`,
    description: site.positioning,
    images: ["/images/og.png"],
  },
  alternates: {
    canonical: site.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body
        className={`${newsreader.variable} ${geistMono.variable} ${bricolage.variable} antialiased flex min-h-screen flex-col`}
      >
        <JsonLd />
        <Nav />
        <main className="flex-1">{children}</main>
        <HideOnHome>
          <Footer />
        </HideOnHome>
      </body>
    </html>
  );
}
