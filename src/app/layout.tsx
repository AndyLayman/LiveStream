import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baseball Stream Overlay",
  description: "Live baseball streaming overlay with scoreboard, count, and game tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
