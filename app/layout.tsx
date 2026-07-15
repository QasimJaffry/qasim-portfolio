import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const siteUrl = "https://qasimhassan.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Qasim Hassan — Senior Full-Stack Engineer",
    template: "%s — Qasim Hassan",
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
  ],
  openGraph: {
    title: "Qasim Hassan — Senior Full-Stack Engineer",
    description: "Shipping AI-powered mobile and web products. React Native · Next.js · AI · Scale.",
    url: siteUrl,
    siteName: "Qasim Hassan",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased flex min-h-screen flex-col`}>
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
