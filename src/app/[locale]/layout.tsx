import type { Metadata } from "next";
import Navbar from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const baseUrl = 'https://lisandroandia.com';

  return {
    title: messages.Metadata.title,
    description: messages.Metadata.description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'es': `${baseUrl}/es`,
        'en': `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: messages.Metadata.title,
      description: messages.Metadata.description,
      url: `${baseUrl}/${locale}`,
      siteName: 'Lisandro Andia Portfolio',
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/profile-about.jpg',
          width: 1200,
          height: 630,
          alt: 'Lisandro Andia - Systems Engineer',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: messages.Metadata.title,
      description: messages.Metadata.description,
      images: ['/profile-about.jpg'],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "es" | "en")) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
        <Footer />
    </NextIntlClientProvider>
  );
}