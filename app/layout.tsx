import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Human Migration Atlas — Journeys Through Time",
  description: "Explore the movement of humanity across geography and time through an interactive 3D globe and evidence-aware migration stories.",
  applicationName: "Human Migration Atlas",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
