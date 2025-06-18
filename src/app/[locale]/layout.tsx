import '@/styles/globals.css';

import { ReactNode } from 'react';
import { Exo_2 } from 'next/font/google';
import { redirect } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import dynamic from 'next/dynamic';

// Import dynamique du ContactFAB pour éviter les problèmes de SSR
const ContactFAB = dynamic(() => import('@/components/ContactFAB'), {
  ssr: false,
});

const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo2',
  display: 'swap',
});

type PageProps = {
  params: {
    locale: string;
  };
  children: ReactNode;
};

export async function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
}

export default async function RootLayout({
  children,
  params: { locale },
}: PageProps) {
  // Validate that the incoming `locale` parameter is valid
  const locales = ['fr', 'en'];
  if (!locales.includes(locale)) {
    // Rediriger vers la locale par défaut 'fr' au lieu d'utiliser notFound()
    redirect('/fr');
  }

  // Load messages for the current locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={`${exo2.variable} p-0`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <ContactFAB />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
