'use client';

import '@/lib/env';

import LanguageSelectionModal from '@/components/LanguageSelectionModal';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { TextLoop } from '@/components/ui/text-loop';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import * as React from 'react';
import { useState } from 'react';

import LogoApp from '~/images/logo-white-2.png';
import Logo from '~/svg/LogoApix.svg';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

// type DocumentType = 'fiis' | 'projets' | 'apix' | null;

export default function HomePage() {
  const t = useTranslations('HomePage');
  const loopTexts = t.raw('loops') as string[];
  const router = useRouter();
  const locale = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetRoute, setTargetRoute] = useState('');

  // Fonction pour ouvrir la modal de sélection de langue
  const handleDocumentClick = (route: string) => {
    setTargetRoute(route);
    setIsModalOpen(true);
  };

  // Fonction pour naviguer vers la page correspondante avec la langue sélectionnée
  const handleSelectLanguage = (language: string) => {
    setIsModalOpen(false);
    
    // Construire l'URL avec le locale actuel et le paramètre de langue
    // Pour Next.js App Router avec internationalisation, les routes doivent conserver le préfixe de locale
    const path = `/${locale}${targetRoute}?language=${language}`;
    console.log(`Redirection vers: ${path}`);
    router.push(path);
  };

  return (
    <main className='flex h-screen w-full overflow-hidden flex-col items-center justify-center bg-[url(/images/bg.jpg)] bg-cover bg-center bg-no-repeat gap-8 p-0'>
      {/* image background */}
      <div className='absolute top-0 left-0 w-full h-full bg-cover bg-black/10 bg-center opacity-5 z-0' />

      {/* Language switcher */}
      <LanguageSwitcher />

      <div className='z-10 flex flex-col items-center justify-center gap-8 px-4 text-center'>
        <Image
          width={500}
          height={300}
          src={LogoApp}
          alt='logo'
          className='w-full max-w-[500px] h-auto'
        />

        <h1 className='text-2xl md:text-4xl font-bold text-white font-exo2'>
          {t('title')}
        </h1>

        <p className='text-lg md:text-2xl font-semibold text-white font-exo2'>
          {t('subtitle')}
        </p>

        <div className='min-h-[60px] md:min-h-[80px] flex items-center justify-center'>
          <TextLoop
            interval={3}
            className='text-xl md:text-3xl font-bold text-white font-exo2 text-center px-4 py-2 rounded-lg bg-black/10 backdrop-blur-sm'
          >
            {loopTexts.map((text: string, index: number) => (
              <span key={index} className='block'>
                {text}
              </span>
            ))}
          </TextLoop>
        </div>

        {/* Documentation buttons */}
        <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl bg-black/10 backdrop-blur-sm'>
          <Button
            onClick={() => handleDocumentClick('/fiis')}
            className='bg-white/5 hover:bg-black/50 text-white font-bold py-6 text-lg font-exo2 shadow-lg'
          >
            FII Senegal
          </Button>
          <Button
            onClick={() => handleDocumentClick('/projets')}
            className='bg-white/5 hover:bg-black/50 text-white font-bold py-6 text-lg font-exo2 shadow-lg'
          >
            Projets Transformateurs
          </Button>
          <Button
            onClick={() => handleDocumentClick('/apix')}
            className='bg-white/5 hover:bg-black/50 text-white font-bold py-6 text-lg font-exo2 shadow-lg'
          >
            Sénégal, carrefour des investissements
          </Button>
        </div>

        <div className='mt-8 flex flex-col items-center justify-center'>
          <Logo className='size-48 md:size-64' />
        </div>
      </div>

      {/* Modal de sélection de langue */}
      <LanguageSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectLanguage={handleSelectLanguage}
      />
    </main>
  );
}
