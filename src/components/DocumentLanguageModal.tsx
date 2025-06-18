'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

interface DocumentLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'fiis' | 'projets' | 'apix';
}

export default function DocumentLanguageModal({
  isOpen,
  onClose,
  documentType,
}: DocumentLanguageModalProps) {
  const router = useRouter();
  const locale = useLocale();

  if (!isOpen) return null;

  const handleLanguageSelect = (language: 'FR' | 'EN') => {
    // Fermer le modal
    onClose();
    
    // Rediriger vers la page du flipbook avec les paramètres appropriés
    router.push(`/${locale}/docs/${documentType}/${language}`);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center font-exo2">
          Choisissez une langue / Choose a language
        </h2>
        
        <div className="flex flex-col space-y-4">
          <Button 
            onClick={() => handleLanguageSelect('FR')}
            className="py-6 text-lg font-exo2"
            variant="outline"
          >
            Français
          </Button>
          
          <Button 
            onClick={() => handleLanguageSelect('EN')}
            className="py-6 text-lg font-exo2" 
            variant="outline"
          >
            English
          </Button>
        </div>
        
        <Button 
          onClick={onClose}
          className="mt-6 w-full font-exo2"
          variant="destructive"
        >
          Annuler / Cancel
        </Button>
      </div>
    </div>
  );
}
