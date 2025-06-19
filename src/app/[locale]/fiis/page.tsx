'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import PDFModal from '@/components/PDFModal';
import { Button } from '@/components/ui/button';

// Modèle pour la modal de langue
const LanguageModal = ({
  isOpen,
  onClose,
  onSelectLanguage,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectLanguage: (lang: string) => void;
}) => {
  // Les hooks doivent être appelés au niveau supérieur avant toute instruction conditionnelle
  const t = useTranslations('Common');

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div
        className='bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-700 w-full max-w-md'
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className='text-5xl font-bold text-white drop-shadow-lg mb-4 font-exo2 tracking-wider'>
          {t('title')}
        </h1>
        <h2 className='text-2xl font-bold text-white mb-6 text-center'>
          {t('chooseLanguage')}
        </h2>
        <div className='grid grid-cols-2 gap-4'>
          <Button
            onClick={() => onSelectLanguage('FR')}
            className='bg-gray-800 hover:bg-gray-700 text-white py-4 text-xl'
          >
            Français
          </Button>
          <Button
            onClick={() => onSelectLanguage('EN')}
            className='bg-gray-800 hover:bg-gray-700 text-white py-4 text-xl'
          >
            English
          </Button>
        </div>
        <Button
          onClick={onClose}
          className='bg-transparent hover:bg-gray-800 text-gray-400 w-full mt-4'
        >
          Annuler / Cancel
        </Button>
      </div>
    </div>
  );
};

export default function FIISPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('FIISPage');
  const currentLocale = useLocale(); // Déplacer le hook au niveau supérieur
  const locale =
    searchParams.get('language') || (currentLocale === 'fr' ? 'FR' : 'EN');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [videoId, setVideoId] = useState('intro.mp4'); // ID de la vidéo YouTube commune pour FR et EN
  const [currentPdfPath, setCurrentPdfPath] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');

  // Récupérer le paramètre de langue de l'URL
  useEffect(() => {
    const language = searchParams.get('language');
    if (language && ['FR', 'EN'].includes(language)) {
      setSelectedLanguage(language);
      setVideoId(language === 'EN' ? 'intro_en.mp4' : 'intro.mp4');
    }
  }, [searchParams]);

  // Gérer la sélection de langue lors du clic sur le bouton "Consulter les documents"
  const handleSelectLanguage = (language: string) => {
    setIsModalOpen(false);
    setSelectedLanguage(language);
    // Plus besoin de changer la vidéo car on utilise la même pour les deux langues
  };

  // Afficher la modal PDF pour les packages
  const viewPackages = () => {
    if (selectedLanguage) {
      const pdfPath =
        selectedLanguage === 'EN'
          ? '/docs/fiis/EN/PACKAGES-EN.pdf'
          : '/docs/fiis/FR/PACKAGES-FINALE-v3 3.pdf';

      setCurrentPdfPath(pdfPath);
      setPdfTitle(t('packagesTitle'));
      setIsPDFModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  // Afficher la modal PDF pour la plaquette
  const viewBrochure = () => {
    if (selectedLanguage) {
      const pdfPath =
        selectedLanguage === 'EN'
          ? '/docs/fiis/EN/Plaquette-FIISEN25-ENv3.pdf'
          : '/docs/fiis/FR/Plaquette-APIX-FIISEN25-FINAL 2.pdf';

      setCurrentPdfPath(pdfPath);
      setPdfTitle(t('brochureTitle'));
      setIsPDFModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className='relative min-h-screen w-full overflow-hidden bg-black'>
      {/* Vidéo YouTube en arrière-plan */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={locale === 'EN' ? '/videos/intro_en.mp4' : '/videos/intro.mp4'}
        autoPlay
        loop
        playsInline
        preload="auto"
        // muted={false} // Pour garder le son, mais l'autoplay ne marchera pas partout
        // controls={false}
        // poster="/images/video-cover.jpg" // Optionnel, image de fallback
      >
        Your browser does not support the video tag.
      </video>

      {/* Overlay pour assombrir un peu la vidéo */}
      {/* <div className='absolute top-0 left-0 w-full h-full bg-white opacity-5 z-10'></div> */}

      <div className='absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-row items-center gap-4'>
        <Button
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg'
          onClick={viewPackages}
        >
          {t('packages')}
        </Button>
        <Button
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg'
          onClick={viewBrochure}
        >
          {t('brochure')}
        </Button>
      </div>

      {/* Modal pour sélectionner la langue */}
      <LanguageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* Modal pour afficher les PDF */}
      <PDFModal
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
        pdfPath={currentPdfPath}
        title={pdfTitle}
      />
    </div>
  );
}
