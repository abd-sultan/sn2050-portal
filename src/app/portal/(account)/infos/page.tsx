'use client';

import PDFViewer from '@/app/portal/(account)/components/PDFViewer';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import { RiArrowLeftCircleFill, RiArrowLeftCircleLine } from 'react-icons/ri';

const infos = [
  {
    title: "GUIDE DU CREATEUR D'ENTREPRISE",
    content: '/resources/GUIDE.pdf',
  },
  {
    title: 'Portefeuille PPP - Situation des Projets P1 - Septembre 2024',
    content: '/resources/PPP_092024.pdf',
  },
  {
    title: 'Présentation ZES',
    content: '/resources/ZES.pdf',
  },
  {
    title: "Incitations liées à l'agrément ZES",
    content: '/resources/AGREMENT_ZES.pdf',
  },
  {
    title:
      "Demande d'autorisation d'installation d'une entreprise dans le parc industriel intégré de Diamniadio",
    content: '/resources/P2ID.pdf',
  },
  {
    title:
      "Demande d'autorisation d'installation dans la zone économique spéciale de DIASS",
    content: '/resources/ZESID.pdf',
  },
  {
    title:
      "Demande d'autorisation d'installation d'une entreprise dans la zone économique spéciale de SANDIARA",
    content: '/resources/ZESS.pdf',
  },
];

export default function InfosPage() {
  const [selectedInfo, setSelectedInfo] = React.useState<any>(null);
  return (
    <div className='flex flex-col w-full min-h-screen h-screen px-12 bg-[#F6F6F6]'>
      <h3 className='text-2xl text-primary font-semibold font-jamjuree'>
        <Link
          href='/portal/sectors'
          className='border border-gray-800 px-2 py-1 rounded-md cursor-pointer text-sm'
        >
          <RiArrowLeftCircleLine className='inline size-4' /> Retour
        </Link>{' '}
        Informations Utiles
      </h3>
      <hr className='my-6' />
      <div className='flex flex-col w-full h-full'>
        <div className='flex flex-col gap-2 w-full z-40'>
          {infos.map((item, index) => (
            <p
              key={index}
              onClick={() => setSelectedInfo(item)}
              className={cn(
                'font-poppins text-sm underline px-2 py-1 rounded-md cursor-pointer',
                selectedInfo && selectedInfo.title === item.title
                  ? 'text-flag-green font-bold'
                  : 'hover:text-flag-green hover:font-bold'
              )}
            >
              {index + 1}. {item.title}
            </p>
          ))}
        </div>
        <div className='flex w-full items-center justify-center'>
          {selectedInfo && <PDFViewer pdfUrl={selectedInfo.content} />}
        </div>
      </div>
    </div>
  );
}
