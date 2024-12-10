'use client';

import PDFViewer from '___src/app/portal/(account)/components/PDFViewer';
import { cn } from '___src/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { RiArrowLeftCircleFill, RiArrowLeftCircleLine } from 'react-icons/ri';

const infos = [
  {
    title: "GUIDE DU CREATEUR D'ENTREPRISE",
    content: '/resources/GUIDE.pdf',
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

const ppp = [
  {
    title: 'Portefeuille PPP - Situation des Projets P1 - Septembre 2024',
    content: '/resources/ppp/PPP_092024.pdf',
  },
  {
    title: 'Senegal: The new technology deal',
    content: '/resources/ppp/SN-new-deal.pdf',
  },
  {
    title: 'PARC DES TECHNOLOGIES NUMÉRIQUES DU SÉNÉGAL A DIAMNIADIO',
    content: '/resources/ppp/PTN-SND2050.pdf',
  },
];

export default function InfosPage() {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [selectedInfo, setSelectedInfo] = React.useState<any>(null);
  const [infosList, setInfosList] = React.useState<any[]>([]);
  const params = useSearchParams();
  const sector = params.get('sector');

  // Adapter la taille de la page PDF en fonction de la largeur de la fenêtre
  const calculateScale = () => {
    if (width > 768) {
      return 0.8; // Taille normale pour les grands écrans
    } else {
      return width / 1500; // Adapter pour les mobiles
    }
  };

  useEffect(() => {
    if (sector === 'PPP') {
      setInfosList(ppp);
    } else {
      setInfosList(infos);
    }
  }, [sector]);

  /* if (sector === 'PPP') {
    return (
      <div className='flex flex-col w-full gap-12 px-12 bg-[#F6F6F6]'>
        <div>
          <Link
            href='/portal/sectors'
            className='border border-gray-800 px-2 py-1 rounded-md cursor-pointer text-sm'
          >
            <RiArrowLeftCircleLine className='inline size-4' /> Retour
          </Link>
        </div>
        <PDFViewer pdfUrl={ppp.content} scale={calculateScale()} />
      </div>
    );
  } */

  return (
    <div className='flex flex-col w-full min-h-screen h-screen px-12 bg-[#F6F6F6]'>
      <h3 className='text-2xl text-primary font-semibold font-jamjuree'>
        <Link
          href='/portal/sectors'
          className='border border-gray-800 px-2 py-1 rounded-md cursor-pointer text-sm'
        >
          <RiArrowLeftCircleLine className='inline size-4' /> Retour
        </Link>{' '}
        {sector === 'PPP' ? 'Portefeuille PPP' : 'Informations APIX'}
      </h3>
      <hr className='my-6' />
      <div className='flex flex-col w-full h-full'>
        <div className='flex flex-col gap-2 w-full z-40'>
          {infosList.map((item, index) => (
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
          {selectedInfo && (
            <PDFViewer
              pdfUrl={selectedInfo.content}
              scale={sector === 'PPP' ? calculateScale() : null}
            />
          )}
        </div>
      </div>
    </div>
  );
}
