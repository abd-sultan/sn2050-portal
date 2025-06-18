'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';

// Import dynamique du PDFViewer pour éviter les problèmes de SSR
const PDFViewer = dynamic(
  () => import('@/app/portal/(account)/components/PDFViewer'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-white">Chargement du document...</p>
      </div>
    ),
  }
);

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfPath: string;
  title?: string;
}

export default function PDFModal({ 
  isOpen, 
  onClose, 
  pdfPath, 
  title 
}: PDFModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [scale, setScale] = useState(1.0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calcule le scale optimal en fonction des dimensions du conteneur
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const calculateOptimalScale = () => {
        const containerHeight = containerRef.current?.clientHeight || 0;
        // Réduire légèrement le scale pour s'assurer que la page entière est visible
        const optimalScale = Math.min(containerHeight / 900 * 0.85, 1.2);
        setScale(optimalScale);
      };
      
      calculateOptimalScale();
      window.addEventListener('resize', calculateOptimalScale);
      
      return () => {
        window.removeEventListener('resize', calculateOptimalScale);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen || !isMounted) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-gray-900 p-4 md:p-6 rounded-lg w-full max-w-6xl mx-4 h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        ref={containerRef}
      >
        <div className="flex justify-between items-center bg-gray-900 py-2 mb-2 border-b border-gray-800 z-10">
          <h2 className="text-xl font-bold text-white">
            {title || "Document"}
          </h2>
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-800"
          >
            <X className="size-6 text-white" />
          </Button>
        </div>
        
        <div className="flex-grow w-full h-full overflow-hidden flex items-center justify-center">
          <PDFViewer pdfUrl={pdfPath} scale={scale} />
        </div>
      </div>
    </div>
  );
}
