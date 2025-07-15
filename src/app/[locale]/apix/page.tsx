'use client';

import { ChevronLeftIcon, FileIcon, VideoIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

import PDFFlipbook from '@/components/PdfFlipbook';
import { Button } from '@/components/ui/button';

// Import dynamique du DocumentViewer pour éviter les problèmes de SSR
const DocumentViewer = dynamic(() => import('@/components/DocumentViewer'), {
  ssr: false,
  loading: () => (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4'></div>
      <p className='text-lg font-medium text-white'>
        Chargement du visualiseur...
      </p>
    </div>
  ),
});

// Interface pour les documents PDF
interface PdfDocument {
  name: string;
  path: string;
  displayName: string;
}

export default function ApixPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations('ApixPage');
  const [selectedFile, setSelectedFile] = useState<PdfDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<PdfDocument[]>([]);

  // Déterminer la langue en fonction du paramètre URL ou de la locale
  const [language, setLanguage] = useState(locale === 'fr' ? 'FR' : 'EN');

  // Gérer le paramètre de langue de l'URL
  useEffect(() => {
    const urlLanguage = searchParams.get('language');
    if (urlLanguage && ['FR', 'EN'].includes(urlLanguage)) {
      setLanguage(urlLanguage);
    }
  }, [searchParams]);

  useEffect(() => {
    // Récupérer la liste des documents en fonction de la langue sélectionnée
    const getDocuments = (language: string) => {
      if (language === 'FR') {
        return [
          {
            name: 'Brochure_InvestirAuSENEGAL_French_140525.pdf',
            path: '/docs/apix/FR/Brochure_InvestirAuSENEGAL_French_140525.pdf',
            displayName: t('brochureInvestirAuSenegal'),
          },
          {
            name: "2.Guide du créateur d'entreprise MAJ 02.2023.pdf",
            path: `/docs/apix/FR/2.Guide du créateur d'entreprise MAJ 02.2023.pdf`,
            displayName: t('guideDuCreateurDentreprise'),
          },
          {
            name: '8.Synthèse CI MAJ 02.2023_.pdf',
            path: '/docs/apix/FR/8.Synthèse CI MAJ 02.2023_.pdf',
            displayName: t('syntheseCodeDesInvestissements'),
          },
          {
            name: 'FICHE RESUME ZES.pdf',
            path: '/docs/apix/FR/FICHE RESUME ZES.pdf',
            displayName: t('ficheResumeZonesEconomiquesSpeciales'),
          },
        ];
      } else {
        return [
          {
            name: 'Brochure_InvestirAuSENEGAL_Anglais_140525.pdf',
            path: '/docs/apix/EN/Brochure_InvestirAuSENEGAL_Anglais_140525.pdf',
            displayName: t('brochureInvestInSenegal'),
          },
          {
            name: "Guide du créateur d'entreprise.pdf",
            path: "/docs/apix/EN/Guide du créateur d'entreprise.pdf",
            displayName: t('businessCreationGuide'),
          },
          {
            name: 'Résumé code des investissements.pdf',
            path: '/docs/apix/EN/Résumé code des investissements.pdf',
            displayName: t('investmentCodeSummary'),
          },
          {
            name: 'FICHE DE RESUME ZES EN ANGLAIS.pdf',
            path: '/docs/apix/EN/FICHE DE RESUME ZES EN ANGLAIS.pdf',
            displayName: t('summarySheetSpecialEconomicZones'),
          },
        ];
      }
    };

    setDocuments(getDocuments(language));
    setIsLoading(false);
  }, [language, t]);

  // Gérer la sélection d'un document
  const handleSelectDocument = (document: PdfDocument) => {
    setSelectedFile(document);
  };

  // Revenir à la liste des documents
  const handleBackToList = () => {
    setSelectedFile(null);
  };

  // Affichage du chargement
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-900 flex flex-col items-center justify-center'>
        <div className='w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
        <p className='mt-4 text-white text-lg'>Chargement...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-900'>
      {/* En-tête avec titre et bouton retour */}
      <div className='py-4 px-6 bg-gray-800 shadow-md sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto flex flex-wrap gap-4 justify-between items-center'>
          <h1 className='text-2xl md:text-3xl font-bold text-white font-exo2'>
            {t('title')}
          </h1>

          <Button
            onClick={() => router.back()}
            variant='ghost'
            className='text-gray-300 hover:text-white hover:bg-gray-700'
          >
            <ChevronLeftIcon size={20} className='mr-1' />
            {t('back')}
          </Button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className='max-w-7xl mx-auto py-8 px-4'>
        {!selectedFile ? (
          // Liste des documents disponibles
          <div>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold mb-6 text-white'>
                {t('availableDocuments')}
              </h2>

              {/* Video fullscreen handler */}
              <Button
                onClick={() => {
                  const video = document.getElementById(
                    'intro-video-fullscreen'
                  ) as HTMLVideoElement | null;
                  if (video) {
                    video.style.display = 'block';
                    video.play();
                    if (video.requestFullscreen) {
                      video.requestFullscreen();
                    } else if ((video as any).webkitRequestFullscreen) {
                      (video as any).webkitRequestFullscreen();
                    } else if ((video as any).msRequestFullscreen) {
                      (video as any).msRequestFullscreen();
                    }
                  }
                }}
                variant='ghost'
                className='text-gray-300 hover:text-white hover:bg-gray-700'
              >
                <VideoIcon size={20} className='mr-1' />
                {t('watchVideo')}
              </Button>
              {/* Hidden video element for fullscreen playback */}
              <video
                id='intro-video-fullscreen'
                src='/videos/the_film.mp4'
                style={{
                  display: 'none',
                  width: '100vw',
                  height: '100vh',
                  background: 'black',
                  zIndex: 9999,
                }}
                controls
                onEnded={(e) => (e.currentTarget.style.display = 'none')}
                onPause={(e) => {
                  // Si l'utilisateur quitte le fullscreen, on cache la vidéo
                  if (!document.fullscreenElement) {
                    e.currentTarget.style.display = 'none';
                  }
                }}
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {documents.map((doc, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectDocument(doc)}
                  className='bg-gray-800 border border-gray-700 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer'
                >
                  <div className='flex items-center mb-3'>
                    <FileIcon className='mr-2 text-blue-500' size={24} />
                    <h3 className='text-lg font-medium text-white truncate'>
                      {doc.displayName}
                    </h3>
                  </div>
                  <p className='text-gray-400 text-sm'>{t('clickToView')}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Affichage du document sélectionné
          <div>
            <div className='mb-4 flex items-center'>
              <Button
                onClick={handleBackToList}
                variant='ghost'
                className='text-gray-300 hover:text-white hover:bg-gray-700 mr-4'
              >
                <ChevronLeftIcon size={20} className='mr-1' />
                {locale === 'fr' ? 'Retour aux documents' : 'Back to documents'}
              </Button>
              <h2 className='text-xl font-bold text-white'>
                {selectedFile.displayName}
              </h2>
            </div>
            <div className='bg-gray-800 p-2 sm:p-4 rounded-lg shadow-lg overflow-x-auto' style={{ maxWidth: '100vw' }}>
              {/* <PDFViewer pdfUrl={selectedFile.path} /> */}
              <PDFFlipbook file={selectedFile.path} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
