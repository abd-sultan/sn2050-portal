'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { projects, sectors } from '@/constant/sectors';
import ProjectDetails from '../components/ProjectDetails';

const Sectors = () => {
  const [selectedSector, setSelectedSector] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sectorId = params.get('sector');
    const projectId = params.get('project');

    if (sectorId) {
      const sector = sectors.find((s) => s.id === sectorId);
      setSelectedSector(sector);

      if (projectId) {
        const project = projects[sectorId].find((p: any) => p.id === projectId);
        setSelectedProject(project);
      }
    }
  }, []);

  const updateURL = (sector: any, project: any) => {
    const params = new URLSearchParams();
    if (sector) params.set('sector', sector.id);
    if (project) params.set('project', project.id);
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
  };

  const handleSectorClick = (sector: any) => {
    setSelectedSector(sector);
    setSelectedProject(null);
    updateURL(sector, null);
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    updateURL(selectedSector, project);
  };

  const handleBack = () => {
    if (selectedProject) {
      setSelectedProject(null);
      updateURL(selectedSector, null);
    } else {
      setSelectedSector(null);
      updateURL(null, null);
    }
  };

  return (
    <div className='w-full p-4'>
      {!selectedSector && (
        <div>
          <h2 className='text-xl font-semibold mb-4 text-center'>
            Sélectionnez le secteur qui vous intéresse
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {sectors.map((sector) => (
              <button
                key={sector.id}
                onClick={() => handleSectorClick(sector)}
                className='bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center'
              >
                <span className='text-4xl mb-2'>{sector.icon}</span>
                <span className='text-sm font-medium text-center'>
                  {sector.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedSector && !selectedProject && (
        <div>
          <button
            onClick={handleBack}
            className='mb-4 text-green-700 flex items-center'
          >
            <ChevronLeft size={20} />
            Retour aux secteurs
          </button>
          <h2 className='text-xl font-semibold mb-4'>
            {selectedSector.id === 'other'
              ? 'Autres projets'
              : `Projets en ${selectedSector.name}`}
          </h2>
          <div className='space-y-2 md:grid md:grid-cols-2 items-center justify-center gap-4'>
            {projects[selectedSector.id].map((project: any) => (
              <button
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className='w-full bg-slate-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow text-left flex justify-between items-center'
              >
                <span>{project.name}</span>
                <ChevronRight size={20} className='text-green-700' />
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedProject && (
        <ProjectDetails project={selectedProject} onBack={handleBack} />
      )}
    </div>
  );
};

export default Sectors;
