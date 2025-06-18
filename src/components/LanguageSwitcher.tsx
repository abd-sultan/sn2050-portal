'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  
  const switchLocale = (newLocale: string) => {
    // Navigation directe vers la nouvelle locale
    router.push(`/${newLocale}`);
  };

  return (
    <div className="absolute top-4 right-4 z-20 flex space-x-2">
      <Button
        variant={locale === 'fr' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLocale('fr')}
        className="font-exo2"
      >
        FR
      </Button>
      <Button
        variant={locale === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLocale('en')}
        className="font-exo2"
      >
        EN
      </Button>
    </div>
  );
}
