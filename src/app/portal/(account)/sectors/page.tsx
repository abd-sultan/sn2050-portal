'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { projects, sectors } from '@/constant/sectors';
import ProjectDetails from '../components/ProjectDetails';
import { Button } from '@/components/ui/button';
import { RiInformation2Fill } from 'react-icons/ri';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

const Sectors = () => {
  const [selectedSector, setSelectedSector] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filteredProject, setFilteredProject] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sectorId = params.get('sector');
    const projectId = params.get('project');

    if (sectorId) {
      const sector = sectors.find((s) => s.id === sectorId);
      setSelectedSector(sector);
      setFilteredProject(projects[sector?.id]);

      if (projectId) {
        const project = projects[sectorId].find((p: any) => p.id === projectId);
        setSelectedProject(project);
      }
    }
  }, []);

  const updateURL = (sector: any, project: any, filename: any) => {
    const params = new URLSearchParams();
    if (sector) params.set('sector', sector.id);
    if (project) params.set('project', project.id);
    if (filename) params.set('fn', filename);
    setFilteredProject(projects[sector?.id]);
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
  };

  const handleSectorClick = (sector: any) => {
    setSelectedSector(sector);
    setSelectedProject(null);
    // setFilteredProject([]);
    updateURL(sector, null, null);
  };

  const handleProjectClick = (project: any, index: number) => {
    setSelectedProject(project);
    updateURL(selectedSector, project, index);
  };

  const handleBack = () => {
    if (selectedProject) {
      setSelectedProject(null);
      setFilteredProject([]);
      updateURL(selectedSector, null, null);
    } else {
      setSelectedSector(null);
      setFilteredProject([]);
      updateURL(null, null, null);
    }
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    const search = e.target?.value;
    const list = projects[selectedSector.id].filter((p: any) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProject(list);
  };

  return (
    <div className='w-full p-4'>
      {!selectedSector && (
        <div>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='w-1/2 text-xs md:text-xl font-semibold md:text-center'>
              Sélectionnez le secteur qui vous intéresse
            </h2>
            <Link
              href='/portal/infos'
              className='w-1/2 flex items-center justify-end gap-2'
            >
              <RiInformation2Fill className='size-6' />
              <span className='hidden md:text-md md:block'>
                Informations Utiles
              </span>
            </Link>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-12 mt-12'>
            {sectors.map((sector) => (
              <div
                key={sector.id}
                onClick={() => handleSectorClick(sector)}
                className='flex flex-col items-center cursor-pointer'
              >
                <img
                  src={`/resources/projects/${sector.slug}/icon.png`}
                  alt={sector.name}
                  className='object-fill h-[100%] w-full'
                  // width={250}
                  // height={250}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSector && !selectedProject && (
        <div>
          <div className='flex items-center justify-between mb-4'>
            <button
              onClick={handleBack}
              className='text-green-700 flex items-center'
            >
              <ChevronLeft size={20} />
              Retour aux secteurs
            </button>
            <img
              src={`/resources/projects/${selectedSector.slug}/icon.png`}
              alt={selectedSector.name}
              className='h-12 w-32'
              // width={250}
              // height={250}
            />
          </div>
          {/* <h2 className='text-xl font-semibold mb-4'>
            {selectedSector.id === 'other'
              ? 'Autres projets'
              : `Projets en ${selectedSector.name}`}
          </h2> */}
          <div className='flex items-center justify-between mb-4'>
            <Input
              placeholder='Rechercher un projet'
              type='text'
              onChange={(e) => handleSearch(e)}
            />
          </div>
          <div className='space-y-2 md:grid md:grid-cols-2 items-center justify-center gap-4'>
            {filteredProject?.length > 0 &&
              filteredProject.map((project: any, index: number) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectClick(project, index + 1)}
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
        <ProjectDetails
          project={selectedProject}
          sector={selectedSector}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default Sectors;
