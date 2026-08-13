import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  weight: ["400", "500", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  weight: ["400", "600"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Noiz Systems — We build the apps that move African commerce",
    template: "%s · Noiz Systems",
  },
  description:
    "Noiz Systems designs, ships and operates its own products — BDMarket for African groceries, and the logistics platform that delivers them.",
  openGraph: {
    title: "Noiz Systems",
    description:
      "Product company building commerce and logistics software for the African diaspora. Paris & beyond.",
    siteName: "Noiz Systems",
    locale: "en",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
