import type { Metadata } from "next";
import { Syne, Outfit, IBM_Plex_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AssistantWidget } from "@/components/ai/AssistantWidget";
import { ScrollTop } from "@/components/providers/ScrollTop";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "NOVA Audio — Hear it. See every layer.",
    template: "%s · NOVA Audio",
  },
  description:
    "Premium wireless headphones and speakers with a cinematic 3D configurator and AI shopping concierge.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon" }],
  },
  openGraph: {
    title: "NOVA Audio",
    description: "Hear it. See every layer. Configure yours.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-void text-text">
        <AppProviders>
          <SmoothScroll>
            <ScrollTop />
            <div className="noise-overlay" aria-hidden />
            <SiteHeader />
            <main className="flex-1 pt-16">{children}</main>
            <SiteFooter />
            <AssistantWidget />
          </SmoothScroll>
        </AppProviders>
      </body>
    </html>
  );
}
