import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import "./globals.css";

// Set NEXT_PUBLIC_SITE_URL to your real domain in production so share previews
// and canonical/sitemap URLs resolve to absolute links.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://devmock.vercel.app";

// Clerk only activates once keys are present, so the app still runs without them.
const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const title = "devmock | Practice real interviews, land your dream role";
const description =
  "devmock simulates company-specific interviews with an AI that plans your rounds, asks the questions you'll actually face, and gives detailed feedback, tailored to the role you're targeting.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | devmock",
  },
  description,
  applicationName: "devmock",
  keywords: [
    "AI mock interview",
    "interview preparation",
    "technical interview practice",
    "coding interview",
    "system design interview",
    "behavioral interview",
    "Amazon interview",
    "Google interview",
    "FAANG interview prep",
    "interview simulator",
    "AI interviewer",
  ],
  authors: [{ name: "devmock" }],
  creator: "devmock",
  publisher: "devmock",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "devmock",
    title,
    description,
    locale: "en_US",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "devmock — Practice real interviews, land your dream role",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@devmock",
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f3f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0e" },
  ],
};

// Runs before paint to set the theme class, preventing a flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;if(d){e.classList.add('dark');}else{e.classList.remove('dark');}}catch(e){}})();`;

// Structured data for richer search results.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "devmock",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: siteUrl,
  description,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tree = (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-page text-ink">
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );

  return clerkEnabled ? <ClerkProvider>{tree}</ClerkProvider> : tree;
}
