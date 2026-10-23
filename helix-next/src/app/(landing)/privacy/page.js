import PrivacyContent from "@/components/landing/PrivacyContent";

export const metadata = {
  metadataBase: new URL("https://helix-azure-six.vercel.app"),
  title: "Privacy Policy | Helix",
  description:
    "Review Helix's Privacy Policy, including our Google OAuth and Google Calendar Limited Use data disclosures, data security, and user rights.",
  keywords: [
    "Helix Privacy Policy",
    "Google Calendar Limited Use",
    "Data Protection",
    "Helix Security",
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
    title: "Privacy Policy | Helix",
    description:
      "Read about how Helix securely manages user data, Google Calendar integrations, and project workflows.",
    url: "https://helix-azure-six.vercel.app/privacy",
    siteName: "Helix",
    type: "article",
    publishedTime: "2026-10-21T00:00:00Z",
    modifiedTime: "2026-10-21T00:00:00Z",
  },
};

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    description:
      "Official Privacy Policy and Google API Limited Use compliance disclosures for the Helix productivity platform.",
    url: "https://helix-azure-six.vercel.app/privacy",
    datePublished: "2026-10-21",
    dateModified: "2026-10-21",
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: "Seraphim Creationverse",
      email: "seraphimcreationverse@gmail.com",
      url: "https://helix-azure-six.vercel.app",
    },
    mainEntity: {
      "@type": "Article",
      headline: "Helix Privacy Policy & Google API Limited Use Disclosure",
      datePublished: "2026-10-21",
      dateModified: "2026-10-21",
      author: {
        "@type": "Organization",
        name: "Seraphim Creationverse",
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
