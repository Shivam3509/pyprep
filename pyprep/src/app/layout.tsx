import type { Metadata } from "next";
import "./globals.css";
import { AuthInitializer } from "@/components/AuthInitializer";

export const metadata: Metadata = {
  title: "PyPrep — Python Interview Preparation Platform",
  description:
    "Master Python interviews with 1000+ questions, AI mock interviews, coding playground, and structured learning paths for Freshers to Senior engineers.",
  keywords: [
    "Python interview",
    "interview preparation",
    "FastAPI",
    "Django",
    "Machine Learning",
    "coding practice",
    "mock interview",
  ],
  authors: [{ name: "PyPrep" }],
  openGraph: {
    title: "PyPrep — Python Interview Preparation Platform",
    description:
      "The most complete Python interview prep platform. Learn, practice, and ace your interviews.",
    type: "website",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthInitializer>{children}</AuthInitializer>
      </body>
    </html>
  );
}
