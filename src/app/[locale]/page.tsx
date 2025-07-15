'use client';

import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import * as React from 'react';
import { useState } from 'react';
import '@/lib/env';

import LanguageSelectionModal from '@/components/LanguageSelectionModal';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { TextLoop } from '@/components/ui/text-loop';

import Logo from '~/images/logo_apix_blanc.png';
import LogoApp from '~/images/logo-white-2.png';

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
    const path = `/${language.toLowerCase()}${targetRoute}?language=${language}`;
    router.push(path);
  };

  return (
    <main className='flex min-h-screen w-full flex-col items-center justify-center bg-[url(/images/bg.jpg)] bg-cover bg-center bg-no-repeat gap-6 p-2 sm:gap-8 sm:p-4 md:p-8 overflow-x-hidden'>
      {/* image background */}
      <div className='absolute top-0 left-0 w-full h-full bg-cover bg-black/10 bg-center opacity-5 z-0' />

      {/* Language switcher */}
      <LanguageSwitcher />

      <div className='z-10 flex flex-col items-center justify-center gap-6 px-2 sm:gap-8 sm:px-4 text-center w-full max-w-3xl'>
        <Image
          width={500}
          height={300}
          src={LogoApp}
          alt='logo'
          className='w-4/5 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl h-auto mx-auto drop-shadow-md'
        />

        <h1 className='text-xl sm:text-2xl md:text-4xl font-bold text-white font-exo2 leading-tight'>
          {t('title')}
        </h1>

        <p className='text-base sm:text-lg md:text-2xl font-semibold text-white font-exo2'>
          {t('subtitle')}
        </p>

        <div className='min-h-[48px] sm:min-h-[60px] md:min-h-[80px] flex items-center justify-center w-full'>
          <TextLoop
            interval={3}
            className='text-base sm:text-xl md:text-3xl font-bold text-white font-exo2 text-center px-2 sm:px-4 py-2 rounded-lg bg-black/10 backdrop-blur-sm w-full'
          >
            {loopTexts.map((text: string, index: number) => (
              <span key={index} className='block'>
                {text}
              </span>
            ))}
          </TextLoop>
        </div>

        {/* Documentation buttons */}
        <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl bg-transparent'>
          <div className='flex flex-col items-center justify-center w-full gap-2'>
            <Button
              onClick={() => handleDocumentClick('/fiis')}
              className='bg-white/5 hover:bg-black/50 w-full text-white font-bold py-4 sm:py-6 text-base sm:text-lg font-exo2 shadow-lg rounded-md transition-all duration-200'
            >
              {t('fiis')}
            </Button>
            <Link
              href='https://fiisenegal.sn/'
              className='italic text-white text-center font-bold py-4 sm:py-6 text-base sm:text-lg font-exo2 underline flex items-center gap-2'
            >
              {t('knowMore')} <ArrowRightIcon />
            </Link>
          </div>

          <Button
            onClick={() => handleDocumentClick('/projets')}
            className='bg-white/5 hover:bg-black/50 w-full text-white font-bold py-4 sm:py-6 text-base sm:text-lg font-exo2 shadow-lg rounded-md transition-all duration-200'
          >
            {t('transformativeProjects')}
          </Button>
          <Button
            onClick={() => handleDocumentClick('/apix')}
            className='bg-white/5 hover:bg-black/50 w-full text-white font-bold py-4 sm:py-6 text-base sm:text-lg font-exo2 shadow-lg flex flex-col items-center justify-center rounded-md transition-all duration-200 break-words whitespace-normal min-w-0 max-w-full text-center'
            style={{ wordBreak: 'break-word', hyphens: 'auto' }}
          >
            <span className='block w-full break-words whitespace-normal text-center'>
              {t('senegalInvestment')}
            </span>
            <p className='text-sm text-gray-50 font-light break-words whitespace-normal w-full text-center'>
              ({t('documentToDownload')})
            </p>
          </Button>
        </div>

        <div className='mt-6 flex flex-col items-center justify-center'>
          <Image
            src={Logo}
            alt='logo'
            width={200}
            height={200}
            className='w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 object-contain drop-shadow-lg'
          />
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
