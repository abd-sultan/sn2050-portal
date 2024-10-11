import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';

// Utiliser la version installée du worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

import { Document, Page } from 'react-pdf';
// Charger le composant PDF de manière dynamique
/* const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  { ssr: false }
);
const Page = dynamic(() => import('react-pdf').then((mod) => mod.Page), {
  ssr: false,
}); */

import { Button } from '@/components/ui/button';

const PDFViewer = ({ pdfUrl }: any) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [width, setWidth] = useState<number>(window.innerWidth);

  function onDocumentLoadSuccess({ numPages }: any) {
    console.log('🚀 ~ onDocumentLoadSuccess ~ numPages:', numPages);
    setNumPages(numPages);
  }

  // Adapter la taille de la page PDF en fonction de la largeur de la fenêtre
  const calculateScale = () => {
    if (width > 768) {
      return 1.5; // Taille normale pour les grands écrans
    } else {
      return width / 600; // Adapter pour les mobiles
    }
  };

  return (
    <div className='w-full flex flex-col items-center justify-center z-40 max-w-full mx-auto pb-4 px-4 bg-white rounded-lg shadow-lg'>
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading='Chargement...'
        renderMode='canvas'
        onLoadError={(error: any) => console.log('onLoadError - error', error)}
        className='flex flex-col items-center justify-center w-full max-w-full'
      >
        <Page
          pageNumber={pageNumber}
          renderTextLayer={true}
          renderAnnotationLayer={true}
          scale={calculateScale()}
          className='mb-4 w-full max-w-full flex items-center justify-center'
        />
      </Document>
      <div className='flex justify-between items-center mt-4 w-full'>
        <Button
          variant='default'
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className='px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300'
        >
          Précédent
        </Button>
        <p className='text-center'>
          Page {pageNumber} sur {numPages}
        </p>
        <Button
          variant='default'
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={pageNumber >= numPages!}
          className='px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300'
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default PDFViewer;
