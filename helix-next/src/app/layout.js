import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { DialogProvider } from "@/components/providers/DialogProvider";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata = {
  title: {
    default: "Helix | Collaboration Reimagined",
    template: "%s | Helix"
  },
  description: "Helix is a modern, high-performance collaboration platform designed to streamline task tracking, projects, and discussions for engineering and design teams.",
  keywords: ["collaboration", "project management", "tasks", "Helix", "kanban", "chat", "calendar"],
  authors: [{ name: "Helix Team" }],
  robots: "index, follow",
  openGraph: {
    title: "Helix | Collaboration Reimagined",
    description: "Helix is a modern, high-performance collaboration platform designed to streamline task tracking, projects, and discussions.",
    url: "https://helix-collab.com",
    siteName: "Helix",
    images: [
      {
        url: "/helix_logo.svg",
        width: 800,
        height: 600,
        alt: "Helix Branding Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Helix | Collaboration Reimagined",
    description: "Helix is a modern, high-performance collaboration platform designed to streamline task tracking, projects, and discussions.",
    images: ["/helix_logo.svg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
    >
      <body>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <DialogProvider>
                {children}
              </DialogProvider>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}