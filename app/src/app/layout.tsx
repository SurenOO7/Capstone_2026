import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppSessionProvider } from "@/components/providers/session-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoalTrack",
  description: "Personal goal tracking platform for the capstone project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppSessionProvider>{children}</AppSessionProvider>
      </body>
    </html>
  );
}
