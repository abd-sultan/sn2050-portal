'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import PDFModal from '@/components/PDFModal';

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
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div
        className='bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-700 w-full max-w-md'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='text-2xl font-bold text-white mb-6 text-center'>
          Choisissez la langue / Choose language
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
  const t = useTranslations('HomePage');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const locale = searchParams.get('language') || 'FR';
  const [videoId, setVideoId] = useState('op7QIy61oVI'); // ID de la vidéo YouTube commune pour FR et EN
  const [currentPdfPath, setCurrentPdfPath] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');

  // Récupérer le paramètre de langue de l'URL
  useEffect(() => {
    const language = searchParams.get('language');
    if (language && ['FR', 'EN'].includes(language)) {
      setSelectedLanguage(language);
      setVideoId(language === 'EN' ? 'EJnU-E8gE68' : 'op7QIy61oVI');
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
      setPdfTitle(
        selectedLanguage === 'EN'
          ? 'FII Senegal Packages'
          : 'Packages FII Sénégal'
      );
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
      setPdfTitle(
        selectedLanguage === 'EN'
          ? 'FII Senegal Brochure'
          : 'Plaquette FII Sénégal'
      );
      setIsPDFModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className='relative min-h-screen w-full overflow-hidden bg-black'>
      {/* Vidéo YouTube en arrière-plan */}
      <div className='absolute top-0 left-0 w-full h-full z-0'>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&loop=1&playlist=${videoId}&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`}
          className='absolute top-0 left-0 w-full h-full object-cover opacity-60'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
          title='Background Video'
        />
        <div className='absolute top-0 left-0 w-full h-full bg-black opacity-0'></div>
      </div>

      {/* Overlay pour assombrir un peu la vidéo */}
      {/* <div className='absolute top-0 left-0 w-full h-full bg-white opacity-5 z-10'></div> */}

      <div className='absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-row items-center gap-4'>
        <Button
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg'
          onClick={viewPackages}
        >
          {selectedLanguage === 'EN' ? 'Packages' : 'Packages'}
        </Button>
        <Button
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg'
          onClick={viewBrochure}
        >
          {selectedLanguage === 'EN' ? 'Brochure' : 'Plaquette'}
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
