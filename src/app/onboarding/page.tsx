'use client';

import OnboardingForm from '@/components/forms/Onboarding';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';
import LogoApp from '~/images/logo-sn2050.jpg';

export default function OnboardingPage() {
  const [formState, setFormState] = React.useState<any>(null);

  return (
    <div className='flex w-full flex-col items-center justify-center'>
      {formState && formState.status === 'success' ? (
        <div className='flex flex-col gap-12 items-center justify-center h-screen/2 p-12 text-center font-poppins font-semibold'>
          <p className='w-full px-6 md:w-1/3 text-lg md:text-2xl text-primary'>
            {formState.message}
          </p>
          <Link href='/signin'>
            <Button variant='outline'>Se connecter</Button>
          </Link>
        </div>
      ) : (
        <>
          <p className='text-center text-lg md:text-2xl font-semibold'>
            Renseignez vos contacts pour plus d'informations sur nos projets
          </p>
          {formState && formState.status === 'error' ? (
            <p className='text-red-500'>{formState.message}</p>
          ) : null}
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
