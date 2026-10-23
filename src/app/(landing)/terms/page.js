import TermsContent from "@/components/landing/TermsContent";

export const metadata = {
  metadataBase: new URL("https://helix.seraphimstudio.in"),
  title: "Terms of Service | Helix",
  description:
    "Read the official Terms of Service for Helix. Review our user agreement, acceptable use policy, and intellectual property terms.",
  keywords: [
    "Helix Terms of Service",
    "User Agreement",
    "Helix Legal",
    "Terms and Conditions",
  ],
  alternates: {
    canonical: "/terms",
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
    title: "Terms of Service | Helix",
    description:
      "Review the terms governing the use of Helix workspaces, tasks, discussions, and integrations.",
    url: "https://helix.seraphimstudio.in/terms",
    siteName: "Helix by Seraphim Studio",
    type: "article",
    publishedTime: "2026-10-21T00:00:00Z",
    modifiedTime: "2026-10-21T00:00:00Z",
  },
};

export default function TermsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Service",
    description:
      "Official Terms of Service and user agreement governing the Helix productivity platform.",
    url: "https://helix.seraphimstudio.in/terms",
    datePublished: "2026-10-21",
    dateModified: "2026-10-21",
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: "Seraphim Studio",
      email: "seraphimcreationverse@gmail.com",
      url: "https://helix.seraphimstudio.in",
    },
    mainEntity: {
      "@type": "Article",
      headline: "Helix Terms of Service & User Agreement",
      datePublished: "2026-10-21",
      dateModified: "2026-10-21",
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
      <TermsContent />
    </>
  );
}
