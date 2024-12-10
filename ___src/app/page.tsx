'use client';

import * as React from 'react';
import '___src/lib/env';
import LogoApp from '~/images/logo-sn2050.jpg';
import LogoApix from '~/images/logo-apix.png';
import Logo from '~/svg/LogoApix.svg';
import Image from 'next/image';
import Countdown from '___src/components/Countdown';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  return (
    <main className='flex min-h-screen overflow-hidden flex-col items-center justify-center bg-[#F6F6F6] gap-12'>
      <Image width={500} height={500} src={LogoApp} alt='logo' />
      <p className='text-center text-xl md:text-4xl font-bold'>
        Bienvenue sur le portefeuille de projets Sénégal 2050
      </p>
      <div className='flex flex-col items-center justify-center'>
        <div>
          {/* <Image src={LogoApix} alt='logo' /> */}
          <Logo className='size-64' />
        </div>
      </div>
      <Countdown />
    </main>
  );
}
