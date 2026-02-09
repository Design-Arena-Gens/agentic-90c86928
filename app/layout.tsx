import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agentic CLI",
  description: "Terminal-inspired agentic workspace with programmable commands and workflows."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
