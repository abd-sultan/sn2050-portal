'use client';

import OnboardingForm from '@/components/forms/Onboarding';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import LogoApp from '~/images/logo-sn2050.png';

export default function OnboardingPage() {
  const [formState, setFormState] = React.useState<any>(null);

  return (
    <div className='flex w-full flex-col items-center justify-center'>
      {formState ? (
        <div className='flex flex-col gap-12 items-center justify-center h-screen/2 p-12 text-center font-poppins font-semibold'>
          {formState.message}
          <Link href='/signin'>
            <Button variant='outline'>Se connecter</Button>
          </Link>
        </div>
      ) : (
        <>
          <p className='text-center text-lg md:text-2xl font-semibold'>
            Renseignez vos contacts pour plus d'informations sur nos projets
          </p>
          <div className='w-full flex items-center justify-center'>
            <OnboardingForm
              handleFormState={(values: any) => setFormState(values)}
            />
          </div>
        </>
      )}
    </div>
  );
}
