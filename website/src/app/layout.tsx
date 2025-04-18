import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hermite's Problem | Novel Approaches for Cubic Irrationals",
  description: "An exploration of novel approaches to solving Hermite's Problem for cubic irrationals",
  keywords: "Hermite's Problem, cubic irrationals, mathematics, number theory, Galois theory, HAPD algorithm",
  authors: [{ name: "Bobby Barclay" }],
  openGraph: {
    title: "Hermite's Problem | Novel Approaches for Cubic Irrationals",
    description: "An exploration of novel approaches to solving Hermite's Problem for cubic irrationals",
    url: "https://hermitesproblem.org",
    siteName: "Hermite's Problem",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hermite's Problem | Novel Approaches for Cubic Irrationals",
    description: "An exploration of novel approaches to solving Hermite's Problem for cubic irrationals",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getInitialTheme() {
                  const persistedTheme = localStorage.getItem('theme');
                  if (persistedTheme) return persistedTheme;
                  
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  return systemTheme;
                }

                function setInitialTheme() {
                  const theme = getInitialTheme();
                  document.documentElement.classList.add(theme);
                  
                  // Add a class to prevent transition flashing
                  document.documentElement.classList.add('theme-init');
                  
                  // Remove the init class after a short delay to enable transitions
                  window.addEventListener('load', () => {
                    setTimeout(() => {
                      document.documentElement.classList.remove('theme-init');
                    }, 50);
                  });
                }

                setInitialTheme();
              })();
            `
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}