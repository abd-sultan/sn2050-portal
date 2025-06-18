'use client';

import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

// Import dynamique de notre nouveau DocumentViewer avec Suspense pour le chargement
const DocumentViewer = dynamic(() => import('@/components/DocumentViewer'), {
  ssr: false, // Désactive SSR pour éviter les problèmes avec les bibliothèques PDF
  loading: () => (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-medium text-gray-700">Chargement du visualiseur...</p>
    </div>
  ),
});

interface PageProps {
  params: {
    type: string;
    language: string;
    locale: string;
  };
}

export default function DocumentPage({ params }: PageProps) {
  const { type, language } = params;
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [pdfPath, setPdfPath] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Valider les paramètres
    if (
      !['fiis', 'projets', 'apix'].includes(type) ||
      !['FR', 'EN'].includes(language)
    ) {
      router.push(`/${locale}`);
      return;
    }

    // Vérifier si un fichier spécifique est demandé dans l'URL
    const fileParam = searchParams.get('file');
    let selectedFileName = '';

    // Si un fichier est spécifié dans l'URL, l'utiliser
    if (fileParam) {
      selectedFileName = fileParam;
    } else {
      // Sinon, utiliser le fichier par défaut pour chaque catégorie
      if (type === 'fiis') {
        selectedFileName =
          language === 'FR'
            ? 'FICHE PROJET FRENCH.pdf'
            : 'FICHE PROJET ANGLAIS.pdf';
      } else if (type === 'projets') {
        selectedFileName = 'document.pdf'; // Même nom pour FR et EN
      } else if (type === 'apix') {
        selectedFileName =
          language === 'FR'
            ? 'Résumé code des investissements.pdf'
            : 'FICHE PROJET ANGLAIS.pdf';
      }
    }

    // Construire le chemin complet du PDF - le dossier 'public' est la racine pour les fichiers statiques
    // donc on ne doit pas inclure '/public' dans l'URL
    const path = `/docs/${type}/${language}/${encodeURIComponent(selectedFileName)}`;
    
    // On utilise directement le chemin relatif sans le préfixe /public
    setPdfPath(path);
    setFileName(selectedFileName);

    // Définir le titre du document
    switch (type) {
      case 'fiis':
        setDocumentTitle(
          "FIIS - Fonds d'Impulsion et d'Innovation pour le Sénégal"
        );
        break;
      case 'projets':
        setDocumentTitle('Projets Transformateurs');
        break;
      case 'apix':
        setDocumentTitle('Sénégal en Bref');
        break;
    }

    setIsLoading(false);
  }, [type, language, locale, router, searchParams]);

  // Utiliser un useState pour afficher le contenu seulement quand tout est prêt
  // afin d'éviter les erreurs d'hydratation
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    if (!isLoading && pdfPath) {
      setIsReady(true);
    }
  }, [isLoading, pdfPath]);
  
  if (!isReady) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-gray-700">
          {locale === 'fr' ? 'Chargement en cours...' : 'Loading...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* En-tête avec titre et bouton de retour */}
      <div className="py-4 px-4 bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-between items-center">
          <h1 className="text-2xl font-bold font-exo2">{documentTitle}</h1>
          
          <Button
            onClick={() => router.push(`/${locale}`)}
            variant="outline"
            className="font-exo2"
          >
            {locale === 'fr' ? "Retour à l'accueil" : 'Back to Home'}
          </Button>
        </div>
      </div>

      {/* Contenu principal avec le DocumentViewer dans un Suspense */}
      <div className="max-w-screen-2xl mx-auto py-6 px-4">
        <Suspense fallback={
          <div className="h-96 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <DocumentViewer
            pdfUrl={pdfPath}
            documentType={type}
            documentLanguage={language}
            fileName={fileName}
          />
        </Suspense>
      </div>
    </div>
  );
}
