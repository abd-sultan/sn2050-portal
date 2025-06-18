'use client';

import { useEffect, useRef, useState } from 'react';

interface FullScreenPDFProps {
  pdfUrl: string;
}

const FullScreenPDF = ({ pdfUrl }: FullScreenPDFProps) => {
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Calculer la hauteur optimale pour une meilleure expérience
  useEffect(() => {
    const updateDimensions = () => {
      if (iframeRef.current) {
        // Calcul de la hauteur disponible en tenant compte des marges et du header
        // 100vh - (hauteur header + marges + autres éléments)
        const availableHeight = window.innerHeight - 180;
        iframeRef.current.style.height = `${Math.max(availableHeight, 500)}px`;
      }
    };

    // Mettre à jour les dimensions au chargement et au redimensionnement
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Simuler un court temps de chargement pour une meilleure UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <div className='flex justify-center items-center h-[500px] w-full'>
        <div className='animate-pulse flex flex-col items-center'>
          <div className='w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4'></div>
          <div className='h-6 bg-gray-200 rounded w-64'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div className='w-full bg-white rounded-lg shadow-lg overflow-hidden'>
        <iframe
          ref={iframeRef}
          src={pdfUrl}
          title='Document PDF'
          className='w-full border-0 h-[calc(100vh-180px)]'
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
};

export default FullScreenPDF;
