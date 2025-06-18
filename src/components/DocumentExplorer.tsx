'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Types pour nos documents
interface DocumentFile {
  name: string;
  alt: string;
  path: string;
}

interface DocumentExplorerProps {
  currentType: string;
  currentLanguage: string;
  currentFileName: string;
  onSelectDocument: (path: string, name: string) => void;
}

const DocumentExplorer = ({
  currentType,
  currentLanguage,
  currentFileName,
  onSelectDocument,
}: DocumentExplorerProps) => {
  const router = useRouter();
  const locale = useLocale();
  const [documents, setDocuments] = useState<{ [key: string]: DocumentFile[] }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  // Définir directement les documents en dur pour chaque catégorie et langue
  useEffect(() => {
    // Définition en dur des documents disponibles
    const documentsData = {
      fiis: {
        FR: [
          {
            name: 'FICHE PROJET FRENCH.pdf',
            alt: 'FICHE PROJET',
            path: `/docs/fiis/FR/FICHE PROJET FRENCH.pdf`,
          },
          {
            name: 'PACKAGES-FINALE-v3 3.pdf',
            alt: 'PACKAGES',
            path: `/docs/fiis/FR/PACKAGES-FINALE-v3 3.pdf`,
          },
          {
            name: 'Plaquette-APIX-FIISEN25-FINAL 2.pdf',
            alt: 'Plaquette FIIS 2025',
            path: `/docs/fiis/FR/Plaquette-APIX-FIISEN25-FINAL 2.pdf`,
          },
        ],
        EN: [
          {
            name: 'FICHE PROJET ANGLAIS.pdf',
            alt: 'PROJECT SHEET',
            path: `/docs/fiis/EN/FICHE PROJET ANGLAIS.pdf`,
          },
          {
            name: 'PACKAGES-EN.pdf',
            alt: 'PACKAGES',
            path: `/docs/fiis/EN/PACKAGES-EN.pdf`,
          },
          {
            name: 'Plaquette-FIISEN25-ENv3.pdf',
            alt: 'FIIS 2025 Brochure',
            path: `/docs/fiis/EN/Plaquette-FIISEN25-ENv3.pdf`,
          },
        ],
      },
      projets: {
        FR: [
          {
            name: 'document.pdf',
            alt: 'PROJETS TRANSFORMATEURS',
            path: `/docs/projets/FR/document.pdf`,
          },
        ],
        EN: [
          {
            name: 'document.pdf',
            alt: 'TRANSFORMERS PROJECTS',
            path: `/docs/projets/EN/document.pdf`,
          },
        ],
      },
      apix: {
        FR: [
          {
            name: 'Brochure_InvestirAuSENEGAL_Anglais_140525.pdf',
            alt: 'BROCHURE INVESTIR AU SENEAGAL',
            path: `/docs/apix/FR/Brochure_InvestirAuSENEGAL_Anglais_140525.pdf`,
          },
          {
            name: "Guide du créateur d'entreprise.pdf",
            alt: 'GUIDE DU CREATEUR D ENTREPRISE',
            path: `/docs/apix/FR/Guide du créateur d'entreprise.pdf`,
          },
          {
            name: 'Résumé code des investissements.pdf',
            alt: 'Résumé code des investissements',
            path: `/docs/apix/FR/Résumé code des investissements.pdf`,
          },
        ],
        EN: [
          {
            name: 'FICHE PROJET ANGLAIS.pdf',
            alt: 'PROJECT SHEET',
            path: `/docs/apix/EN/FICHE PROJET ANGLAIS.pdf`,
          },
          {
            name: 'PACKAGES-EN.pdf',
            alt: 'Investisor Packages',
            path: `/docs/apix/EN/PACKAGES-EN.pdf`,
          },
          {
            name: 'Plaquette-FIISEN25-ENv3.pdf',
            alt: 'Investisments Code Summary',
            path: `/docs/apix/EN/Plaquette-FIISEN25-ENv3.pdf`,
          },
        ],
      },
    };

    // Récupérer les documents pour le type et la langue actuels
    const typeKey = currentType as keyof typeof documentsData;
    const docsForCurrentTypeAndLang =
      documentsData[typeKey]?.[currentLanguage as 'FR' | 'EN'] || [];

    setDocuments({ [currentType]: docsForCurrentTypeAndLang });
    setIsLoading(false);
  }, [currentType, currentLanguage]);

  if (isLoading) {
    return (
      <div className='w-full p-4 bg-white/70 rounded-lg animate-pulse'>
        <div className='h-6 bg-gray-300 rounded w-3/4 mb-3'></div>
        <div className='h-4 bg-gray-200 rounded w-full mb-2'></div>
        <div className='h-4 bg-gray-200 rounded w-5/6 mb-2'></div>
        <div className='h-4 bg-gray-200 rounded w-4/6'></div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <div
        className='flex items-center justify-between p-3 bg-blue-600 text-white cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className='font-medium text-lg'>
          {locale === 'fr' ? 'Documents disponibles' : 'Available documents'}
        </h3>
        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </div>

      {isOpen && (
        <div className='p-4'>
          {Object.keys(documents).map((type) => (
            <div key={type} className='mb-3'>
              <h4 className='font-bold text-lg capitalize mb-2'>{type}</h4>
              <ul className='space-y-2 pl-2'>
                {documents[type].map((doc) => (
                  <li key={doc.path}>
                    <Link
                      href={`/${locale}/docs/${currentType}/${currentLanguage}?file=${encodeURIComponent(
                        doc.name
                      )}`}
                      className={`block text-left px-2 py-1 rounded transition uppercase ${
                        doc.name === currentFileName
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectDocument(doc.path, doc.name);
                        router.refresh();
                      }}
                    >
                      {doc.alt}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className='mt-4 pt-3 border-t border-gray-200'>
            <h4 className='font-medium mb-2'>
              {locale === 'fr' ? 'Autres catégories' : 'Other categories'}
            </h4>
            <div className='flex flex-wrap gap-2'>
              {['fiis', 'projets', 'apix'].map(
                (type) =>
                  type !== currentType && (
                    <Link
                      key={type}
                      href={`/${locale}/docs/${type}/${currentLanguage}`}
                      className='px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm capitalize transition'
                    >
                      {type}
                    </Link>
                  )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentExplorer;
