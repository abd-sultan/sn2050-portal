'use client';

import React from 'react';
import { ChevronLeft, Contact2, Mailbox } from 'lucide-react';
import FabButton from '@/components/buttons/FabButton';
import PDFViewer from '@/app/portal/(account)/components/PDFViewer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useSession } from 'next-auth/react';
import { getConnectedUser } from '@/lib/utils';

const MySwal = withReactContent(Swal);

const ProjectDetails = ({ project, onBack }: any) => {
  const pdfUrl = '/resources/project.pdf';
  const user = getConnectedUser();

  const handleAddToFavorites = async () => {
    console.log('🚀 ~ handleAddToFavorites ~ user:', user);
    try {
      const res = await fetch('/api/projects/favs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id, projectId: project.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error('Failed to add to favorites');
      } else {
        console.log('🚀 ~ handleAddToFavorites ~ res:', data);
        if (data.status === 'error') {
          MySwal.fire({
            title: <p>{data.message}</p>,
            icon: 'success',
            confirmButtonText: 'Fermer',
            confirmButtonColor: 'green',
            customClass: {
              container: 'bg-flag-green text-white',
            },
          });
        } else {
          // Ajoutez la fonctionnalité de favoris ici
          MySwal.fire({
            title: <p>{data.message}</p>,
            icon: 'success',
            confirmButtonText: 'Fermer',
            confirmButtonColor: 'green',
            customClass: {
              container: 'bg-flag-green text-white',
            },
          });
        }
      }
    } catch (error) {
      console.log('🚀 ~ handleAddToFavorites ~ error:', error);
    }
  };

  return (
    <div className='bg-white p-4 rounded-lg shadow'>
      <button
        onClick={onBack}
        className='mb-4 text-green-700 flex items-center'
      >
        <ChevronLeft size={20} />
        Retour
      </button>
      <h3 className='text-xl font-bold mb-2'>{project.name}</h3>
      {user.role === 'USER' && (
        <FabButton
          onClick={handleAddToFavorites}
          children={
            <p className='flex items-center justify-centertext-white font-urbanist text-center'>
              J’aimerai en savoir plus sur ce projet
            </p>
          }
          className='bg-green-600 h-12 w-64 px-4'
        />
      )}
      {/* <button
        onClick={openPDF}
        className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors'
      >
        Ouvrir le fichier du projet
      </button> */}
      <div className='p-4'>
        {/* <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          className='w-full h-screen md:h-[600px] border-0'
          title='PDF Viewer'
        /> */}
        <PDFViewer pdfUrl={pdfUrl} />
      </div>
    </div>
  );
};

export default ProjectDetails;
