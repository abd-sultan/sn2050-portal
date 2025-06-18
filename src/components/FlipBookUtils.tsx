'use client';

import React, { useEffect, useState } from 'react';

/**
 * Utilitaire pour convertir un PDF en images pour le flipbook
 * Cette fonctionnalité nécessiterait normalement un traitement côté serveur
 *
 * Note: Dans une implémentation réelle, vous devriez:
 * 1. Soit utiliser une API backend pour convertir le PDF en images
 * 2. Soit pré-convertir le PDF en images lors du build
 * 3. Soit utiliser un service tiers pour la conversion
 */
export const usePdfPages = (pdfPath: string) => {
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dans une vraie implémentation, ce code:
    // 1. Chargerait le PDF
    // 2. Déterminerait le nombre de pages
    // 3. Convertirait chaque page en image

    // Simulation d'un chargement
    const timer = setTimeout(() => {
      // Supposons que le PDF a 20 pages
      setPageCount(20);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pdfPath]);

  return { pageCount, isLoading, error };
};

// Composant pour afficher un message pendant le chargement des pages
export const LoadingOverlay: React.FC = () => (
  <div className='absolute inset-0 bg-white/80 flex items-center justify-center z-10'>
    <div className='text-center'>
      <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
      <p className='text-lg font-medium'>Chargement du document...</p>
    </div>
  </div>
);

// Composant pour afficher un message d'erreur
export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className='absolute inset-0 bg-white/80 flex items-center justify-center z-10'>
    <div className='text-center max-w-md p-6 bg-white shadow-lg rounded-lg'>
      <div className='text-red-500 text-5xl mb-4'>⚠️</div>
      <h3 className='text-xl font-bold mb-2'>Erreur de chargement</h3>
      <p className='text-gray-600'>{message}</p>
    </div>
  </div>
);
