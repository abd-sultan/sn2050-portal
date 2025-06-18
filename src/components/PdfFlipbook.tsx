'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';

import { Button } from './ui/button';

// Import de type uniquement pour TypeScript
type PdfViewerProps = {
  pdfPath: string;
  pageNumber: number;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
  width: number;
};

// Définir un composant temporaire pour le chargement
const LoadingPdf = () => <div className="h-96 w-full flex items-center justify-center"><p>Chargement du PDF...</p></div>;

// Chargement dynamique du composant PDF avec dynamic pour éviter les problèmes SSR
const PDFViewer = dynamic<PdfViewerProps>(
  () => import('./PdfViewer').then(mod => mod.default),
  { ssr: false, loading: () => <LoadingPdf /> }
);

interface PdfFlipbookProps {
  pdfPath: string;
  documentType: string;
  language?: string;
}

export default function PdfFlipbook({ pdfPath, documentType }: PdfFlipbookProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageWidth, setPageWidth] = useState(600);
  const [mounted, setMounted] = useState(false);

  // Effet de montage pour les opérations côté client uniquement
  useEffect(() => {
    setMounted(true);
    
    // Ajuster la taille selon l'écran
    const handleResize = () => {
      const width = Math.min(window.innerWidth * 0.9, 800);
      setPageWidth(width);
    };
    
    // Initialiser la taille et mettre en place l'écouteur de redimensionnement
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gérer le chargement réussi du document PDF
  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // Le titre selon le type de document
  const getDocumentTitle = () => {
    switch(documentType) {
      case 'fiis': return 'FIIS - Fonds d\'Impulsion et d\'Innovation pour le Sénégal';
      case 'projets': return 'Projets Transformateurs';
      case 'apix': return 'Sénégal en Bref';
      default: return documentType;
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 font-exo2 text-center">
        {getDocumentTitle()}
      </h1>
      
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden p-4">
        {/* N'afficher le composant PDF que côté client */}
        {mounted && (
          <div className="flex justify-center">
            <div className="pdf-viewer-container"> 
              {/* Le composant utilise un iframe directement côté client */}
              <PDFViewer
                pdfPath={pdfPath}
                pageNumber={pageNumber}
                onDocumentLoadSuccess={handleDocumentLoadSuccess}
                width={pageWidth}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <p className="text-center text-lg font-exo2">
            Page {pageNumber} sur {numPages || '?'}
          </p>
          
          <div className="flex gap-4">
            <Button 
              onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1 || !mounted}
              className="bg-blue-600 hover:bg-blue-700"
            >
              ← Précédente
            </Button>
            <Button 
              onClick={() => setPageNumber(Math.min(numPages || 1, pageNumber + 1))}
              disabled={pageNumber >= (numPages || 1) || !mounted}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Suivante →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
