import Providers from "@/components/providers/Providers";
import { SITE_NAME } from "@/lib/constants";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Brit Asian Matchmaking UK`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "The UK's trusted matchmaking service for Brit Asian singles. Register free, browse verified profiles, and find your life partner across England, Scotland, Wales & Northern Ireland.",
  keywords: [
    "UK matrimony",
    "Brit Asian dating",
    "British Asian marriage",
    "Hindu matrimony UK",
    "Sikh matrimony UK",
    "Muslim matrimony UK",
    "matchmaking UK",
    "shaadi UK alternative",
  ],
  openGraph: {
    title: `${SITE_NAME} — The UK's Trusted Brit Asian Matchmaking Service`,
    description:
      "Join 50,000+ verified Brit Asian singles. Register free and find your life partner on the UK's dedicated matrimony platform.",
    locale: "en_GB",
    type: "website",
    siteName: SITE_NAME,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="site-ambient min-h-full flex flex-col font-sans bg-background text-muted"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
