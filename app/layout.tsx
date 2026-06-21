import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "devmock | Practice real interviews, land your dream role",
  description:
    "devmock simulates company-specific interviews with an AI that plans your rounds, asks real questions, and gives detailed feedback, tailored to the role you're targeting.",
};

// Runs before paint to set the theme class, preventing a flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;if(d){e.classList.add('dark');}else{e.classList.remove('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-page text-ink">
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
