'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { ChevronLeftIcon, FileIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import PDFViewer from '@/app/portal/(account)/components/PDFViewer';

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
  const t = useTranslations('HomePage');
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
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
    // Définir les documents disponibles en fonction de la langue sélectionnée
    const getDocuments = () => {
      if (language === 'FR') {
        return [
          {
            name: "2.Guide du créateur d'entreprise MAJ 02.2023.pdf",
            path: `/docs/apix/FR/2.Guide du créateur d'entreprise MAJ 02.2023.pdf`,
            displayName: "Guide du créateur d'entreprise",
          },
          {
            name: '8.Synthèse CI MAJ 02.2023_.pdf',
            path: '/docs/apix/FR/8.Synthèse CI MAJ 02.2023_.pdf',
            displayName: 'Synthèse Code des Investissements',
          },
          {
            name: 'Brochure_InvestirAuSENEGAL_French_140525.pdf',
            path: '/docs/apix/FR/Brochure_InvestirAuSENEGAL_French_140525.pdf',
            displayName: 'Brochure - Investir au Sénégal',
          },
          {
            name: 'FICHE RESUME ZES.pdf',
            path: '/docs/apix/FR/FICHE RESUME ZES.pdf',
            displayName: 'Fiche résumé - Zones Économiques Spéciales',
          },
        ];
      } else {
        return [
          {
            name: "Guide du créateur d'entreprise.pdf",
            path: "/docs/apix/EN/Guide du créateur d'entreprise.pdf",
            displayName: 'Business Creation Guide',
          },
          {
            name: 'Résumé code des investissements.pdf',
            path: '/docs/apix/EN/Résumé code des investissements.pdf',
            displayName: 'Investment Code Summary',
          },
          {
            name: 'Brochure_InvestirAuSENEGAL_Anglais_140525.pdf',
            path: '/docs/apix/EN/Brochure_InvestirAuSENEGAL_Anglais_140525.pdf',
            displayName: 'Brochure - Invest in Senegal',
          },
          {
            name: 'FICHE DE RESUME ZES EN ANGLAIS.pdf',
            path: '/docs/apix/EN/FICHE DE RESUME ZES EN ANGLAIS.pdf',
            displayName: 'Summary Sheet - Special Economic Zones',
          },
        ];
      }
    };

    setDocuments(getDocuments());
    setIsLoading(false);
  }, [language]);

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
          <h1 className='text-2xl font-bold font-exo2 text-white'>
            {locale === 'fr'
              ? 'Sénégal, carrefour des investissements'
              : 'Senegal, crossroads of investments'}
          </h1>

          <Button
            onClick={() => router.back()}
            variant='ghost'
            className='text-gray-300 hover:text-white hover:bg-gray-700'
          >
            <ChevronLeftIcon size={20} className='mr-1' />
            {locale === 'fr' ? 'Retour' : 'Back'}
          </Button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className='max-w-7xl mx-auto py-8 px-4'>
        {!selectedFile ? (
          // Liste des documents disponibles
          <div>
            <h2 className='text-xl font-bold mb-6 text-white'>
              {locale === 'fr'
                ? 'Documents disponibles'
                : 'Available documents'}
            </h2>
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
                  <p className='text-gray-400 text-sm'>
                    {locale === 'fr'
                      ? 'Cliquez pour consulter'
                      : 'Click to view'}
                  </p>
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
            <div className='bg-gray-800 p-4 rounded-lg shadow-lg'>
              {/* <DocumentViewer
                pdfUrl={selectedFile.path}
                documentType="apix"
                documentLanguage={language}
                fileName={selectedFile.name}
              /> */}
              <PDFViewer pdfUrl={selectedFile.path} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
