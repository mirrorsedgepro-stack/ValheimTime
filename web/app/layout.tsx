import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Odin's Hall - Valheim Modded Dedicated Server Portal",
  description: "Live join code, server status, mod downloads, and connection instructions for Odin's Hall Valheim server.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-valheim-bg text-slate-100 antialiased min-h-screen flex flex-col selection:bg-valheim-gold selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
