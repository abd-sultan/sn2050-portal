'use client';

import React, { useEffect, useState } from 'react';

interface PdfViewerProps {
  pdfPath: string;
  pageNumber: number;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
  width: number;
}

export default function PdfViewer({ 
  pdfPath, 
  pageNumber, 
  onDocumentLoadSuccess,
  width 
}: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement du document et la détection du nombre de pages
    // Dans une implémentation réelle, vous pourriez utiliser une bibliothèque comme pdfjs-dist
    // pour obtenir le nombre de pages, mais pour éviter les problèmes de SSR,
    // nous simulons ce comportement
    
    const timer = setTimeout(() => {
      // Simulation: nous présumons que chaque PDF a entre 5 et 20 pages
      const estimatedPages = Math.floor(Math.random() * 15) + 5;
      onDocumentLoadSuccess({ numPages: estimatedPages });
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [onDocumentLoadSuccess, pdfPath]);

  return (
    <div className="flex flex-col items-center w-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-96 w-full">
          <p className="text-lg">Chargement du document PDF...</p>
        </div>
      ) : (
        // Utiliser un iframe pour afficher le PDF
        // Cette méthode est compatible avec tous les navigateurs et ne nécessite pas de bibliothèques externes
        <iframe
          src={`${pdfPath}#page=${pageNumber}`}
          title="PDF Viewer"
          style={{ width: `${width}px`, height: `${width * 1.4}px` }}
          className="border-0 shadow-lg rounded-lg"
        />
      )}
    </div>
  );
}
