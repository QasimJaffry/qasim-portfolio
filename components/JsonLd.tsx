import { site } from "@/lib/site";

export default function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    url: site.url,
    email: site.email,
    jobTitle: site.title,
    description: site.positioning,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressCountry: "PK",
    },
    sameAs: [site.social.github, site.social.linkedin, site.social.upwork],
    knowsAbout: [
      "React Native",
      "Expo",
      "Next.js",
      "TypeScript",
      "AI product engineering",
      "RevenueCat",
      "Stripe",
      "Firebase",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: `${site.name} — Portfolio`,
    description: site.positioning,
    publisher: { "@id": `${site.url}/#person` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
