import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Braun Color Synth | Model 3000",
  description: "Professional color palette generator and analyzer",
  icons: {
    icon: "/favi-synth.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceMono.variable} font-sans min-h-screen w-full flex items-center justify-center p-4 bg-zinc-950 bg-metal overflow-y-auto selection:bg-console-accent selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
