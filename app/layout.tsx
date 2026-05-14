import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduPilot - Pilot Your Education Journey",
  description: "AI-powered learning platform for Hong Kong schools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
