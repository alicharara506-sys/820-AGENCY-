import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "820 Agency — We Build the Algorithm Behind Growth",
  description:
    "820 is a creative technology agency combining brand, digital, technology, AI and analytics to build the algorithm behind growth.",
  metadataBase: new URL("https://820agency.com"),
  openGraph: {
    title: "820 Agency",
    description: "We build the algorithm behind growth.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
