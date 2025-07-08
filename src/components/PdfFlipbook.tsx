import {
  ArrowLeft,
  ArrowRight,
  Download,
  Fullscreen,
  Minimize,
} from 'lucide-react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import React, { useEffect, useRef, useState } from 'react';
import ReactPageFlip from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';

import { Button } from '@/components/ui/button';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfFlipbookProps {
  file: File | string | null;
}

interface PdfFlipbookProps {
  file: File | string | null;
}

interface DocumentLoadSuccessProps {
  numPages: number;
  pdf: PDFDocumentProxy;
}

export default function PdfFlipbook({ file }: PdfFlipbookProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pageRatio, setPageRatio] = useState<number>(1.414); // Default A4
  const [containerWidth, setContainerWidth] = useState<number>(400);
  const [pdfPageWidth, setPdfPageWidth] = useState<number>(1);
  const [pdfPageHeight, setPdfPageHeight] = useState<number>(1);
  const flipbookRef = useRef<ReactPageFlip | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive width observer
  useEffect(() => {
    function handleResize() {
      // Responsive : padding sur mobile, maxWidth sur desktop, minWidth pour éviter un flipbook trop petit
      const screenWidth = window.innerWidth;
      const maxWidth = 900; // desktop
      const minWidth = 200;
      const padding = screenWidth < 640 ? 32 : 0; // 32px (2*16px) sur mobile, 0 sinon
      const calculatedWidth = Math.max(
        minWidth,
        Math.min(maxWidth, screenWidth - padding)
      );
      setContainerWidth(calculatedWidth);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get real PDF page ratio
  function onDocumentLoadSuccess({
    numPages,
    pdf,
  }: {
    numPages: number;
    pdf: PDFDocumentProxy;
  }) {
    setNumPages(numPages);
    setCurrentPage(1);
    // Correction : toujours extraire la vraie taille de la première page du PDF
    if (
      pdf &&
      typeof pdf.getPage === 'function' &&
      typeof pdf.numPages === 'number' &&
      pdf.numPages > 0
    ) {
      pdf.getPage(1).then((page) => {
        const viewport = page.getViewport({ scale: 1 });
        setPageRatio(viewport.height / viewport.width);
        setPdfPageWidth(viewport.width);
        setPdfPageHeight(viewport.height);
      });
    }
  }

  // Correction supplémentaire : si numPages ou file change et pdfPageWidth reste à 1, tente de relire la taille
  useEffect(() => {
    if (numPages > 0 && file) {
      import('pdfjs-dist/build/pdf').then((pdfjsLib) => {
        const loadingTask = pdfjsLib.getDocument(file);
        loadingTask.promise.then((pdf) => {
          pdf.getPage(1).then((page) => {
            const viewport = page.getViewport({ scale: 1 });
            setPageRatio(viewport.height / viewport.width);
            setPdfPageWidth(viewport.width);
            setPdfPageHeight(viewport.height);
          });
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numPages, file]);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      flipbookRef.current?.pageFlip().flipPrev();
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
      flipbookRef.current?.pageFlip().flipNext();
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      /* Ignore fullscreen errors */
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Calculate height based on width and ratio
  const flipbookHeight = Math.round(containerWidth * pageRatio);
  // Always contain: compute scale so the PDF page always fits in the flipbook area
  const scale =
    pdfPageWidth > 1 && pdfPageHeight > 1
      ? Math.min(containerWidth / pdfPageWidth, flipbookHeight / pdfPageHeight)
      : 1;

  return (
    <div
      ref={containerRef}
      className='w-full max-w-3xl mx-auto flex flex-col items-center px-2 sm:px-0'
    >
      <div
        className='mx-auto'
        style={{ width: containerWidth, height: flipbookHeight }}
      >
        {file && (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className='flex justify-center items-center h-full'>
                Loading PDF...
              </div>
            }
          >
            {/* Debug info pour diagnostic */}
            <div className='text-xs text-gray-400 text-center mb-2'>
              scale: {scale.toFixed(2)}, largeur PDF: {pdfPageWidth}, hauteur
              PDF: {pdfPageHeight}
            </div>
            {numPages === 0 && (
              <div className='text-red-500 text-center mt-4'>
                Aucune page à afficher dans ce PDF.
              </div>
            )}
            <ReactPageFlip
              ref={flipbookRef}
              width={containerWidth}
              height={flipbookHeight}
              style={{ width: containerWidth, height: flipbookHeight }}
              size='fixed'
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              onFlip={(e: { data: number }) => setCurrentPage(e.data + 1)}
              className='shadow-2xl rounded-lg overflow-hidden'
            >
              {Array.from(new Array(numPages), (el, index) => (
                <div
                  key={`page_${index + 1}`}
                  className='w-full h-full bg-white flex items-center justify-center'
                  style={{ overflow: 'hidden' }}
                >
                  <Page
                    pageNumber={index + 1}
                    scale={scale}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    className='border border-gray-200'
                    onRenderError={(error) => (
                      <div className='flex justify-center items-center h-full text-red-500'>
                        Erreur de rendu PDF : {error.message}
                      </div>
                    )}
                    onLoadError={(error) => (
                      <div className='flex justify-center items-center h-full text-red-500'>
                        Erreur de chargement PDF : {error.message}
                      </div>
                    )}
                  />
                </div>
              ))}
            </ReactPageFlip>
          </Document>
        )}
      </div>

      <div className='flex items-center space-x-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg mt-4'>
        <Button
          onClick={goToPreviousPage}
          disabled={currentPage <= 1}
          className='rounded-full w-12 h-12 p-0'
          aria-label='Page précédente'
        >
          <ArrowLeft size={20} />
        </Button>

        <span className='font-medium text-gray-700'>
          Page {currentPage} sur {numPages}
        </span>

        <Button
          onClick={goToNextPage}
          disabled={currentPage >= numPages}
          className='rounded-full w-12 h-12 p-0'
          aria-label='Page suivante'
        >
          <ArrowRight size={20} />
        </Button>

        <Button
          onClick={toggleFullscreen}
          variant='outline'
          className='rounded-full w-12 h-12 p-0'
          aria-label={
            isFullscreen ? 'Quitter le plein écran' : 'Activer le plein écran'
          }
        >
          {isFullscreen ? <Minimize size={20} /> : <Fullscreen size={20} />}
        </Button>

        {typeof file === 'string' && (
          <Button
            asChild
            variant='outline'
            className='rounded-full w-12 h-12 p-0'
            aria-label='Télécharger le PDF'
          >
            <a href={file} download>
              <Download size={20} />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
