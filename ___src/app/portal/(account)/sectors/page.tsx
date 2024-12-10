'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { projects, en_projects, sectors } from '___src/constant/sectors';
import ProjectDetails from '../components/ProjectDetails';
import { Button } from '___src/components/ui/button';
import { RiInformation2Fill } from 'react-icons/ri';
import Link from 'next/link';
import Image from 'next/image';
import LogoApix from '~/images/logo-apix.png';
import { Input } from '___src/components/ui/input';
import { useRouter } from 'next/navigation';
import { update } from 'lodash';

const Sectors = () => {
  const router = useRouter();
  const params = new URLSearchParams();
  const langId = params.get('lang');
  const [selectedSector, setSelectedSector] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filteredProject, setFilteredProject] = useState([]);
  const [lang, setLang] = useState({ name: 'Français', code: 'fr' });
  const [currentProject, setCurrentProject] = useState(projects);

  const handleLangChange = () => {
    if (lang.code === 'fr') {
      setCurrentProject(en_projects);
      setLang({ name: 'Anglais', code: 'en' });
    } else {
      setCurrentProject(projects);
      setLang({ name: 'Français', code: 'fr' });
    }
    const clang = lang.code === 'fr' ? 'en' : 'fr';
    updateURL(selectedSector, selectedProject, null, clang);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sectorId = params.get('sector');
    const projectId = params.get('project');

    if (sectorId) {
      const sector: any = sectors.find((s) => s.id === sectorId);
      setSelectedSector(sector);
      if (lang.code === 'en') {
        setFilteredProject(en_projects[sector?.id]);
      } else {
        setFilteredProject(projects[sector?.id]);
      }

      if (projectId) {
        let project: any;
        if (lang.code === 'en') {
          setCurrentProject(en_projects);
          project = en_projects[sectorId].find((p: any) => p.id === projectId);
        } else {
          setCurrentProject(projects);
          project = currentProject[sectorId].find(
            (p: any) => p.id === projectId
          );
        }

        setSelectedProject(project);
      }
    }
  }, [lang]);

  const updateURL = (
    sector: any,
    project: any,
    filename: any,
    lang: any = 'fr'
  ) => {
    const params = new URLSearchParams();
    if (sector) params.set('sector', sector.id);
    if (project) params.set('project', project.id);
    if (filename) params.set('fn', filename);
    if (lang) params.set('lang', lang);
    setFilteredProject(currentProject[sector?.id]);
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
    const list = currentProject[selectedSector.id].filter((p: any) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProject(list);
  };

  return (
    <div className='w-full p-4'>
      {!selectedSector && (
        <div>
          <div className='flex items-center justify-center mb-4'>
            <h2 className='w-full text-xs md:text-xl font-semibold md:text-center'>
              Sélectionnez le secteur qui vous intéresse
            </h2>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-12 mt-12'>
            {sectors.map((sector) => (
              <div
                key={sector.id}
                onClick={() => handleSectorClick(sector)}
                className='flex flex-col items-center cursor-pointer'
              >
                <img
                  src={`/resources/projects/${sector.slug}/icon.png`}
                  alt={sector.name}
                  className='object-fill h-12 md:h-[100%] w-full md:w-full'
                  // width={250}
                  // height={250}
                />
              </div>
            ))}
            <div>
              <Link href='/portal/infos?sector=PPP' className='w-full'>
                <Button className='w-full h-12 md:h-20 rounded-xl rounded-tr-[1.7rem] rounded-bl-[1.7rem] md:rounded-tr-[2.5rem] md:rounded-bl-[3rem] bg-flag-red'>
                  PPP
                </Button>
              </Link>
            </div>
            <div>
              <Link href='/portal/infos' className='w-full'>
                <Button className='w-full bg-white h-12 md:h-20 rounded-xl rounded-tr-[1.7rem] rounded-bl-[1.7rem] md:rounded-tr-[2.5rem] md:rounded-bl-[3rem]'>
                  <Image
                    src={LogoApix}
                    alt='logo'
                    width={64}
                    height={64}
                    className='object-contain'
                  />
                </Button>
              </Link>
            </div>
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
            <Button variant='outline' size='sm' onClick={handleLangChange}>
              {langId === 'fr' || lang.code === 'fr'
                ? 'Version anglaise'
                : 'Version française'}
            </Button>

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
          lang={lang}
        />
      )}
    </div>
  );
};

export default Sectors;
