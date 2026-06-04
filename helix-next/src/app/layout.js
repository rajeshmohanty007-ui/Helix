import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

import { Inter, Diplomata, Saira } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const diplomata = Diplomata({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-diplomata",
});

const saira = Saira({
  subsets: ["latin"],
  variable: "--font-saira",
});


export const metadata = {
  title: "Helix",
  description: "Workspace for creators",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${diplomata.variable} ${saira.variable}`}
    >
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}