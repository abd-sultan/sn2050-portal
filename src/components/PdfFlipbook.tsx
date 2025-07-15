import React, { useCallback, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page as ReactPdfPage, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfFlipbookProps {
  file: File | string | null;
}

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 424;

const Page = React.forwardRef(
  (
    {
      pageNumber,
      width,
      height,
    }: { pageNumber: number; width: number; height: number },
    ref
  ) => {
    return (
      <div ref={ref}>
        <ReactPdfPage
          pageNumber={pageNumber}
          width={width}
          height={height}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </div>
    );
  }
);

export default function PdfFlipbook({ file }: PdfFlipbookProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [fullscreenRequested, setFullscreenRequested] = React.useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfPageWidth, setPdfPageWidth] = useState<number>(DEFAULT_WIDTH);
  const [pdfPageHeight, setPdfPageHeight] = useState<number>(DEFAULT_HEIGHT);
  const [containerWidth, setContainerWidth] = useState<number>(DEFAULT_WIDTH);
  const [containerHeight, setContainerHeight] =
    useState<number>(DEFAULT_HEIGHT);

  // Ajuste la largeur du flipbook selon la taille de l'écran (mobile, tablette, desktop)
  React.useEffect(() => {
    function handleResize() {
      const screenWidth = window.innerWidth;
      // padding de sécurité sur mobile
      const padding = screenWidth < 640 ? 24 : 0;
      // On ne dépasse jamais la largeur réelle de la page PDF ni 600px
      const maxWidth = Math.min(pdfPageWidth, 600, screenWidth - padding);
      const ratio = pdfPageHeight / pdfPageWidth;
      setContainerWidth(maxWidth);
      setContainerHeight(Math.round(maxWidth * ratio));
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pdfPageWidth, pdfPageHeight]);

  // Lors du chargement du PDF, on récupère le nombre de pages et la taille réelle de la première page
  const onDocumentLoadSuccess = useCallback(async (pdf: any) => {
    setNumPages(pdf.numPages);
    try {
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      setPdfPageWidth(viewport.width);
      setPdfPageHeight(viewport.height);
      // On ajuste immédiatement la taille du flipbook
      const screenWidth = window.innerWidth;
      const padding = screenWidth < 640 ? 24 : 0;
      const maxWidth = Math.min(viewport.width, 600, screenWidth - padding);
      const ratio = viewport.height / viewport.width;
      setContainerWidth(maxWidth);
      setContainerHeight(Math.round(maxWidth * ratio));
      // Plein écran automatique sur mobile
      /* if (typeof window !== 'undefined' && window.innerWidth < 640 && containerRef.current && !fullscreenRequested) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          (containerRef.current as any).webkitRequestFullscreen();
        } else if ((containerRef.current as any).msRequestFullscreen) {
          (containerRef.current as any).msRequestFullscreen();
        }
        setFullscreenRequested(true);
      } */
    } catch {
      setPdfPageWidth(DEFAULT_WIDTH);
      setPdfPageHeight(DEFAULT_HEIGHT);
      setContainerWidth(DEFAULT_WIDTH);
      setContainerHeight(DEFAULT_HEIGHT);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className='w-full max-w-3xl mx-auto flex flex-col items-center px-2 sm:px-0 overflow-x-auto'
    >
      <div className='mx-auto w-full'>
        {file && (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div>Chargement du PDF…</div>}
          >
            {numPages > 0 && (
              <HTMLFlipBook width={containerWidth} height={containerHeight}>
                {Array.from({ length: numPages }, (_, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={containerWidth}
                    height={containerHeight}
                  />
                ))}
              </HTMLFlipBook>
            )}
          </Document>
        )}
      </div>
    </div>
  );
}
