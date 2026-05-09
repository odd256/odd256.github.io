import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import "highlight.js/styles/atom-one-dark.css";

import { siteConfig } from "@/config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/SiteHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { SiteFooter } from "@/components/SiteFooter";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { websiteId, scriptUrl } = siteConfig.analytics.umami;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {websiteId && (
          <Script
            async
            src={scriptUrl}
            data-website-id={websiteId}
            strategy="afterInteractive"
          />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col min-h-screen">
            <div className="flex-grow">
              <SiteHeader />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <AppSidebar />
                <div className="lg:col-span-9">
                  {children}
                </div>
              </div>
            </div>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
