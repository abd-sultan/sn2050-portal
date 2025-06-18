'use client';

import {
  Book,
  Download,
  FileText,
  PanelLeft,
  PanelLeftClose,
  Share2,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

import PDFViewer from '@/app/portal/(account)/components/PDFViewer';

import DocumentExplorer from './DocumentExplorer';

// Import dynamique des composants d'affichage PDF pour éviter les erreurs SSR
const Flipbook3D = dynamic(() => import('./Flipbook3D'), { ssr: false });
const FullScreenPDF = dynamic(() => import('./FullScreenPDF'), { ssr: false });

interface DocumentViewerProps {
  pdfUrl: string;
  documentType: string;
  documentLanguage: string;
  fileName: string;
}

const DocumentViewer = ({
  pdfUrl,
  documentType,
  documentLanguage,
  fileName,
}: DocumentViewerProps) => {
  const locale = useLocale();
  const router = useRouter();
  const [isFlipbookMode, setIsFlipbookMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentFileName, setCurrentFileName] = useState(fileName);

  // On perçoit le nom de fichier de l'URL
  useEffect(() => {
    setCurrentFileName(fileName);
  }, [fileName]);

  // Gestionnaire de changement de document
  const handleDocumentChange = (path: string, name: string) => {
    setCurrentFileName(name);

    // Naviguer vers la page du nouveau document tout en restant sur la même page
    window.history.pushState(
      {},
      '',
      `/${locale}/docs/${documentType}/${documentLanguage}?file=${encodeURIComponent(
        name
      )}`
    );

    // Forcer un rechargement pour mettre à jour le contenu du PDF
    router.refresh();
  };

  // Fonction pour télécharger le PDF actuel
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = currentFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fonction pour partager le document (via l'API Web Share si disponible)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentFileName,
          url: window.location.href,
        });
      } catch (error) {
        // Ignorer l'erreur de partage silencieusement
      }
    } else {
      // Fallback: copier le lien dans le presse-papiers
      navigator.clipboard.writeText(window.location.href);
      alert(
        locale === 'fr'
          ? 'Lien copié dans le presse-papiers!'
          : 'Link copied to clipboard!'
      );
    }
  };

  return (
    <div className='flex flex-col md:flex-row w-full gap-4 min-h-screen bg-gray-50 p-4'>
      {/* Panneau latéral avec l'explorateur de documents */}
      <div
        className={`${
          showSidebar ? 'w-full md:w-80 lg:w-96' : 'w-0 overflow-hidden'
        } transition-all duration-300 ease-in-out flex-shrink-0`}
      >
        {showSidebar && (
          <div className='sticky top-4'>
            <DocumentExplorer
              currentType={documentType}
              currentLanguage={documentLanguage}
              currentFileName={currentFileName}
              onSelectDocument={handleDocumentChange}
            />
          </div>
        )}
      </div>

      {/* Contenu principal avec visualiseur PDF et contrôles */}
      <div className='flex-grow flex flex-col'>
        <div className='bg-white p-4 rounded-lg shadow-md mb-4 flex flex-wrap items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className='p-2 rounded-full hover:bg-gray-100'
              title={showSidebar ? 'Masquer le panneau' : 'Afficher le panneau'}
            >
              {showSidebar ? (
                <PanelLeftClose size={20} />
              ) : (
                <PanelLeft size={20} />
              )}
            </button>

            <h2 className='text-lg font-medium truncate max-w-md'>
              {currentFileName}
            </h2>
          </div>

          <div className='flex items-center gap-2'>
            {/* Boutons pour changer le mode d'affichage */}
            <button
              disabled
              onClick={() => setIsFlipbookMode(true)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${
                isFlipbookMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Book size={18} />
              <span className='hidden sm:inline'>Flipbook</span>
            </button>

            <button
              onClick={() => setIsFlipbookMode(false)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${
                !isFlipbookMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <FileText size={18} />
              <span className='hidden sm:inline'>Lecture</span>
            </button>

            <div className='h-6 w-px bg-gray-300 mx-1'></div>

            {/* Bouton de téléchargement */}
            <button
              onClick={handleDownload}
              className='p-2 rounded-md hover:bg-gray-100'
              title={locale === 'fr' ? 'Télécharger' : 'Download'}
            >
              <Download size={18} />
            </button>

            {/* Bouton de partage */}
            <button
              onClick={handleShare}
              className='p-2 rounded-md hover:bg-gray-100'
              title={locale === 'fr' ? 'Partager' : 'Share'}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Affichage du document selon le mode choisi */}
        <div className='bg-white p-4 rounded-lg shadow-md flex-grow'>
          {/* {isFlipbookMode ? (
            <Flipbook3D pdfUrl={pdfUrl} />
          ) : (
            <FullScreenPDF pdfUrl={pdfUrl} />
          )} */}
          <PDFViewer pdfUrl={pdfUrl} />
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
