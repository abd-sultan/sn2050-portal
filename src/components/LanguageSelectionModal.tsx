'use client';

import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLanguage: (language: string) => void;
  title?: string;
}

export default function LanguageSelectionModal({
  isOpen,
  onClose,
  onSelectLanguage,
  title
}: LanguageSelectionModalProps) {
  const locale = useLocale();
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center font-exo2">
          {title || (locale === 'fr' 
            ? 'Sélectionnez une langue' 
            : 'Select a language')}
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => onSelectLanguage('FR')}
            className="bg-blue-950 hover:bg-blue-800 text-white py-4 text-lg font-exo2"
          >
            Français
          </Button>
          <Button
            onClick={() => onSelectLanguage('EN')}
            className="bg-blue-950 hover:bg-blue-800 text-white py-4 text-lg font-exo2"
          >
            English
          </Button>
        </div>
        
        <Button
          onClick={onClose}
          variant="ghost"
          className="w-full mt-4 text-gray-400 hover:text-white hover:bg-gray-800"
        >
          {locale === 'fr' ? 'Annuler' : 'Cancel'}
        </Button>
      </div>
    </div>
  );
}
