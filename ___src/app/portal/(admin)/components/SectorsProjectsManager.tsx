import React, { useState, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  FolderPlus,
  FileText,
  Loader2,
  X,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '___src/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '___src/components/ui/dialog';
import { Button } from '___src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '___src/components/ui/dropdown-menu';
import { Input } from '___src/components/ui/input';
import { Label } from '___src/components/ui/label';
import { Alert, AlertDescription } from '___src/components/ui/alert';
import { Progress } from '___src/components/ui/progress';
import ProjectCard from '___src/app/portal/(admin)/components/ProjectCard';

const AlertMessage = ({ message, variant, onClose }: any) => (
  <Alert
    className={`mb-4 ${
      variant === 'destructive'
        ? 'bg-red-100 border-red-400'
        : 'bg-green-100 border-green-400'
    }`}
  >
    <AlertDescription className='flex justify-between items-center'>
      <span>{message}</span>
      <Button variant='ghost' size='sm' onClick={onClose}>
        <X className='h-4 w-4' />
      </Button>
    </AlertDescription>
  </Alert>
);

const SecureImage = ({ iconKey, alt, className }: any) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!iconKey) return null;

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </div>
      )}
      <img
        src={`/api/files/${encodeURIComponent(iconKey)}`}
        alt={alt}
        className={className}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        style={{ display: loading ? 'none' : 'block' }}
      />
      {error && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
          <span className='text-red-500'>Erreur de chargement</span>
        </div>
      )}
    </div>
  );
};

const SecureFile = ({ fileKey, fileName, className }: any) => {
  const handleClick = (e: any) => {
    e.preventDefault();
    window.open(`/api/files/${encodeURIComponent(fileKey)}`, '_blank');
  };

  return (
    <a
      href='#'
      onClick={handleClick}
      className={`hover:underline ${className}`}
    >
      {fileName}
    </a>
  );
};
const SectorsProjectsManager = () => {
  const [sectors, setSectors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [activeSector, setActiveSector] = useState<any>(null);
  const [showSectorDialog, setShowSectorDialog] = useState<boolean>(false);
  const [showProjectDialog, setShowProjectDialog] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [alert, setAlert] = useState<any>(null);

  const showAlert = (message: any, variant = 'default') => {
    setAlert({ message, variant });
    setTimeout(() => setAlert(null), 3000);
  };

  // Charger les secteurs
  useEffect(() => {
    fetchSectors();
  }, []);

  const fetchSectors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sectors');
      const data = await response.json();
      setSectors(data);
    } catch (error) {
      showAlert('Impossible de charger les secteurs', 'destructive');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSector = async (e: any) => {
    e.preventDefault();
    try {
      setUploadProgress(0);
      const formData = new FormData(e.target);

      const response = await fetch('/api/sectors', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok)
        throw new Error('Erreur lors de la création du secteur');

      const newSector = await response.json();
      setSectors([...sectors, newSector]);
      setShowSectorDialog(false);
      showAlert('Secteur créé avec succès');
    } catch (error: any) {
      showAlert(error.message, 'destructive');
    }
  };

  const handleUpdateSector = async (e: any, sectorId: any) => {
    e.preventDefault();
    try {
      setUploadProgress(0);
      const formData = new FormData(e.target);

      const response = await fetch(`/api/sectors/${sectorId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok)
        throw new Error('Erreur lors de la mise à jour du secteur');

      const updatedSector = await response.json();
      setSectors(
        sectors.map((s: any) => (s._id === sectorId ? updatedSector : s))
      );
      setShowSectorDialog(false);
      showAlert('Secteur mis à jour avec succès');
    } catch (error: any) {
      showAlert(error.message, 'destructive');
    }
  };

  const handleDeleteSector = async (sectorId: any) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce secteur ?')) return;

    try {
      const response = await fetch(`/api/sectors/${sectorId}`, {
        method: 'DELETE',
      });

      if (!response.ok)
        throw new Error('Erreur lors de la suppression du secteur');

      setSectors(sectors.filter((s: any) => s._id !== sectorId));
      showAlert('Secteur supprimé avec succès');
    } catch (error: any) {
      showAlert(error.message, 'destructive');
    }
  };

  const handleAddProject = async (e: any, sectorId: any) => {
    e.preventDefault();
    try {
      setUploadProgress(0);
      const formData = new FormData(e.target);
      formData.append('sector', sectorId);

      const response = await fetch('/api/projects/core', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Erreur lors de la création du projet');

      const newProject = await response.json();
      // Mise à jour du state avec le nouveau projet
      setSectors(
        sectors.map((sector: any) => {
          if (sector._id === sectorId) {
            return {
              ...sector,
              projects: [...(sector.projects || []), newProject],
            };
          }
          return sector;
        })
      );
      setShowProjectDialog(false);
      showAlert('Projet créé avec succès');
    } catch (error: any) {
      showAlert(error.message, 'destructive');
    }
  };

  const handleDeleteProject = async (projectId: any, sectorId: any) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      const response = await fetch(`/api/projects/core/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok)
        throw new Error('Erreur lors de la suppression du projet');

      setSectors(
        sectors.map((s: any) => {
          if (s._id === sectorId) {
            return {
              ...s,
              projects: s.projects.filter((p: any) => p._id !== projectId),
            };
          }
          return s;
        })
      );
      showAlert('Projet supprimé avec succès');
    } catch (error: any) {
      showAlert(error.message, 'destructive');
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='p-8'>
      {alert && (
        <AlertMessage
          message={alert.message}
          variant={alert.variant}
          onClose={() => setAlert(null)}
        />
      )}

      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Gestion des Secteurs et Projets</h1>
        <Dialog open={showSectorDialog} onOpenChange={setShowSectorDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Nouveau Secteur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editMode ? 'Modifier le Secteur' : 'Nouveau Secteur'}
              </DialogTitle>
            </DialogHeader>
            <form
              className='space-y-4'
              onSubmit={(e) =>
                editMode
                  ? handleUpdateSector(e, activeSector._id)
                  : handleAddSector(e)
              }
            >
              <div>
                <Label htmlFor='name'>Nom du secteur</Label>
                <Input
                  id='name'
                  name='name'
                  required
                  defaultValue={editMode ? activeSector?.name : ''}
                />
              </div>
              <div>
                <Label htmlFor='icon'>Icône</Label>
                <Input
                  id='icon'
                  name='icon'
                  type='file'
                  accept='image/*'
                  required={!editMode}
                />
              </div>
              {uploadProgress > 0 && (
                <Progress value={uploadProgress} className='w-full' />
              )}
              <Button type='submit' className='w-full'>
                {editMode ? 'Modifier' : 'Créer'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {sectors && sectors.length > 0 ? (
          sectors.map((sector) => (
            <Card key={sector._id}>
              <CardHeader>
                <div className='flex justify-between items-start'>
                  <CardTitle className='text-xl'>{sector.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon'>
                        <Pencil className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditMode(true);
                          setActiveSector(sector);
                          setShowSectorDialog(true);
                        }}
                      >
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='text-red-600'
                        onClick={() => handleDeleteSector(sector._id)}
                      >
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>
                  {sector.projects?.length || 0} projet(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SecureImage
                  iconKey={sector.iconKey}
                  alt={sector.name}
                  className='w-full h-40 object-contain rounded-md mb-4'
                />

                <div className='space-y-4'>
                  <Dialog
                    open={showProjectDialog && activeSector?._id === sector._id}
                    onOpenChange={(open) => {
                      setShowProjectDialog(open);
                      if (!open) setActiveSector(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant='outline'
                        className='w-full'
                        onClick={() => setActiveSector(sector)}
                      >
                        <FolderPlus className='mr-2 h-4 w-4' />
                        Ajouter un projet
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Nouveau Projet dans {sector.name}
                        </DialogTitle>
                      </DialogHeader>
                      <form
                        className='space-y-4'
                        onSubmit={(e) => handleAddProject(e, sector._id)}
                      >
                        <div>
                          <Label htmlFor='name'>Nom du projet</Label>
                          <Input id='name' name='name' required />
                        </div>
                        <div>
                          <Label htmlFor='file'>Document PDF</Label>
                          <Input
                            id='file'
                            name='file'
                            type='file'
                            accept='.pdf'
                            required
                          />
                        </div>
                        {uploadProgress > 0 && (
                          <Progress value={uploadProgress} className='w-full' />
                        )}
                        <Button type='submit' className='w-full'>
                          Créer
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {(sector.projects || []).map((project: any) => (
                    <Card key={project._id} className='p-4'>
                      <div className='flex justify-between items-center'>
                        <div className='flex items-center'>
                          <FileText className='h-4 w-4 mr-2' />
                          <SecureFile
                            fileKey={project.fileKey}
                            fileName={project.name}
                            className='hover:underline'
                          />
                        </div>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-red-600'
                          onClick={() =>
                            handleDeleteProject(project._id, sector._id)
                          }
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <p className='text-center text-xl'>Aucun secteur</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectorsProjectsManager;
