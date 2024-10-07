'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Page() {
  // get auth user and redirect it to /portal/backoffice or /portal/sectors
  const router = useRouter();
  const { data: session } = useSession();
  console.log('🚀 ~ Page ~ session:', session);
  const user = session?.user;

  console.log('🚀 ~ Page ~ user:', session);
  router.push('/portal/backoffice');

  // decouper l'email
  const username = user?.email?.split('@')[0];

  if (user) {
    if (user?.role === 'ADMIN' || username === 'admin') {
      router.push('/portal/backoffice');
    } else {
      router.push('/portal/sectors');
    }
  } else {
    router.push('/onboarding');
  }

  return null;
}
