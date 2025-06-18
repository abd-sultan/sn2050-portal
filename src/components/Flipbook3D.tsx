'use client';

import { useEffect, useState } from 'react';

interface Flipbook3DProps {
  pdfUrl: string;
}

const Flipbook3D = ({ pdfUrl }: Flipbook3DProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10); // Valeur par défaut
  const [isFlipping, setIsFlipping] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simuler un chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Gérer le changement de page avec animation
  const flipPage = (direction: 'prev' | 'next') => {
    if (isFlipping) return;

    setIsFlipping(true);
    
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }

    // Réinitialiser l'animation après un délai
    setTimeout(() => {
      setIsFlipping(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-48 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div 
        className={`relative aspect-[4/3] bg-white shadow-xl rounded-lg overflow-hidden transition-transform ${isFlipping ? 'animate-page-flip' : ''}`}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Le PDF affiché dans une iframe */}
        <iframe 
          src={`${pdfUrl}#page=${currentPage}`}
          className="w-full h-full border-0"
          title="Document PDF"
        />
        
        {/* Overlay pour l'effet de page qui tourne */}
        {isFlipping && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent to-black opacity-20"
          ></div>
        )}
      </div>
      
      {/* Contrôles de pagination avec effet 3D */}
      <div className="flex justify-between items-center mt-6 px-4">
        <button 
          onClick={() => flipPage('prev')} 
          disabled={currentPage <= 1}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Page précédente
        </button>
        
        <span className="text-lg font-bold">
          Page {currentPage} sur {totalPages}
        </span>
        
        <button 
          onClick={() => flipPage('next')} 
          disabled={currentPage >= totalPages}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Page suivante
        </button>
      </div>
    </div>
  );
};

export default Flipbook3D;
