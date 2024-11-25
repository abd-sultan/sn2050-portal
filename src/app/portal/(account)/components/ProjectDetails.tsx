'use client';

import React, { useState } from 'react';
import { ChevronLeft, Contact2, Mailbox } from 'lucide-react';
import FabButton from '@/components/buttons/FabButton';
import PDFViewer from '@/app/portal/(account)/components/PDFViewer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { getConnectedUser } from '@/lib/utils';

const MySwal = withReactContent(Swal);

const ProjectDetails = ({ project, sector, onBack, lang }: any) => {
  const params = new URLSearchParams(window.location.search);
  const filename = params.get('fn');
  const folder = lang.code === 'en' ? 'projects_en' : 'projects';
  const pdfUrl = `/resources/${folder}/${sector.slug}/${filename}.pdf`;
  console.log('🚀 ~ ProjectDetails ~ pdfUrl:', pdfUrl);
  const [user, setUser] = useState<any>(getConnectedUser());

  const handleAddToFavorites = async () => {
    // const user = getConnectedUser();
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
      {/* <h3 className='text-xl font-bold mb-2'>{project.name}</h3> */}
      {user.role === 'USER' && (
        <FabButton
          onClick={handleAddToFavorites}
          children={
            <p className='flex items-center justify-centertext-white font-urbanist text-center'>
              J’aimerais en savoir plus sur ce projet
            </p>
          }
          className='bg-green-600 h-12 w-64 px-4'
        />
      )}

      <div className=''>
        <PDFViewer pdfUrl={pdfUrl} />
      </div>
    </div>
  );
};

export default ProjectDetails;
