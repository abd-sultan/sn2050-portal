'use client';

import { useEffect, useRef, useState } from 'react';

import { ChevronLeftIcon } from 'lucide-react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import PdfFlipbook from '@/components/PdfFlipbook';

export default function ProjetsPage() {
  const t = useTranslations('ProjetsPage');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [pdfPath, setPdfPath] = useState('/docs/projets/FR/document.pdf');
  const [windowReady, setWindowReady] = useState(false);



  // Vérification que le composant est rendu côté client et gestion du paramètre de langue
  useEffect(() => {
    setWindowReady(true);
    
    // Récupérer le paramètre de langue
    const language = searchParams.get('language');
    if (language && ['FR', 'EN'].includes(language)) {
      setPdfPath(`/docs/projets/${language}/document.pdf`);
    }
    
    // Simuler un chargement pour éviter des problèmes d'hydratation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [searchParams]);



  if (!windowReady || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-white text-lg">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* En-tête avec titre et bouton retour */}
      <div className="w-full px-6 py-3">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white font-exo2">
            {t('title')}
          </h1>
          
          <Button 
            onClick={() => router.back()}
            variant="ghost" 
            className="flex items-center text-gray-300 hover:text-white"
          >
            <ChevronLeftIcon size={20} className="mr-1" />
            {t('back')}
          </Button>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-blue-600 to-transparent mt-2"></div>
      </div>
      
      {/* Conteneur du visualiseur PDF en plein écran */}
      <div 
        className="flex-grow w-full flex items-center justify-center p-4 bg-gray-900" 
      >
        <div className="w-full h-full flex justify-center items-center">
          <PdfFlipbook file={pdfPath} />
        </div>
      </div>
    </div>
  );
}
