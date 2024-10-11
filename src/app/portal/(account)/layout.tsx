import { Metadata } from 'next';
import * as React from 'react';

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

import { siteConfig } from '@/constant/config';
import Image from 'next/image';
import LogoApp from '~/images/logo-sn2050.jpg';
import { Button } from '@/components/ui/button';
import { auth, signOut } from 'auth';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';

// !STARTERCONF Change these default meta
// !STARTERCONF Look at @/constant/config to change them
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  // !STARTERCONF this is the default favicon, you can generate your own from https://realfavicongenerator.net/
  // ! copy to /favicon folder
  icons: {
    icon: '/images/logo-sn2050.jpg',
    shortcut: '/images/logo-sn2050.jpg',
    apple: '/images/logo-sn2050.jpg',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/logo-sn2050.jpg`],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/logo-sn2050.jpg`],
    // creator: '@th_clarence',
  },
  // authors: [
  //   {
  //     name: 'Theodorus Clarence',
  //     url: 'https://theodorusclarence.com',
  //   },
  // ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  /* if (!session) {
    redirect('/portal');
  } */

  // Fonction asynchrone côté serveur pour la déconnexion
  /* async function handleSignOutServer() {
    'use server'; // Utilisation de Server Actions de Next.js 14

    // Effectue la déconnexion côté serveur (via API ou logique custom)
    const res = await signOut(); // Attention, signOut côté serveur est différent du client
    console.log('🚀 ~ handleSignOutServer ~ res:', res);
    if (res) {
      // Redirection après déconnexion
      redirect('/');
    }
  } */

  const handleSignOutClient = async () => {
    'use server';
    await signOut({ redirect: false }); // Ne pas rediriger automatiquement
    redirect('/'); // Redirige vers la page de connexion après la déconnexion
  };

  return (
    <html lang='fr'>
      <body>
        <main className='flex max-h-screen h-screen flex-col items-center bg-[#F6F6F6]'>
          <div className='w-full p-12 flex gap-12 flex-col-reverse md:flex-row items-center justify-between'>
            <div className='flex md:flex-col-reverse md:items-start md:gap-4 items-center justify-between w-full space-x-4'>
              <p className='text-lg md:text-3xl font-semibold underline underline-offset-8'>
                Bienvenue {session?.user?.firstName}!
              </p>
              <div className='flex flex-col md:flex-row gap-4'>
                {session && (
                  <form action={handleSignOutClient}>
                    <Button type='submit' variant='destructive'>
                      Se Déconnecter
                    </Button>
                  </form>
                )}
                {session && session?.user?.role === 'ADMIN' && (
                  <Link href='/portal/backoffice'>
                    <Button variant='outline'>Tableau de bord</Button>
                  </Link>
                )}
              </div>
            </div>
            <Image src={LogoApp} alt='onboarding' />
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
