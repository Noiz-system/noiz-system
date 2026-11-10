import type { Metadata } from "next";
import { JetBrains_Mono, Noto_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { locale as localeRootParam } from "next/root-params";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { getLanding } from "@/lib/cms";
import "@/app/globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getLanding();

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.ogDescription,
      siteName: "Noiz Systems",
      locale: await localeRootParam(),
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await localeRootParam();

  // The `[locale]` segment also catches unknown top-level paths, so anything
  // that is not a supported language is a 404 rather than a broken render.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={`${notoSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
