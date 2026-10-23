import PrivacyContent from "@/components/landing/PrivacyContent";

export const metadata = {
  metadataBase: new URL("https://helix.seraphimstudio.in"),
  title: "Privacy Policy | Helix - A Product of Seraphim Studio",
  description:
    "Review Helix's Privacy Policy, including our Google OAuth and Google Calendar Limited Use data disclosures, data security, and user rights. Helix is a product of Seraphim Studio.",
  keywords: [
    "Helix Privacy Policy",
    "Google Calendar Limited Use",
    "Data Protection",
    "Helix Security",
    "Seraphim Studio",
    "Privacy",
  ],
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Privacy Policy | Helix - A Product of Seraphim Studio",
    description:
      "Read about how Helix (by Seraphim Studio) securely manages user data, Google Calendar integrations, and project workflows.",
    url: "https://helix.seraphimstudio.in/privacy",
    siteName: "Helix by Seraphim Studio",
    type: "article",
    publishedTime: "2026-10-21T00:00:00Z",
    modifiedTime: "2026-10-23T00:00:00Z",
  },
};

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    description:
      "Official Privacy Policy and Google API Limited Use compliance disclosures for the Helix productivity platform, a product of Seraphim Studio.",
    url: "https://helix.seraphimstudio.in/privacy",
    datePublished: "2026-10-21",
    dateModified: "2026-10-23",
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: "Seraphim Studio",
      email: "seraphimcreationverse@gmail.com",
      url: "https://helix.seraphimstudio.in",
    },
    mainEntity: {
      "@type": "Article",
      headline: "Helix Privacy Policy & Google API Limited Use Disclosure",
      datePublished: "2026-10-21",
      dateModified: "2026-10-23",
      author: {
        "@type": "Organization",
        name: "Seraphim Studio",
      },
    },
  };

  return (
    <>
      {/* Robot-readable JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PrivacyContent />
    </>
  );
}
