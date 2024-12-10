import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Loader2, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';

const showAlert = ({ message, variant, onClose }: any) => (
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

const ProjectCard = ({ project, onDelete }: any) => {
  const [loading, setLoading] = useState(false);

  const handleFileClick = async (e: any, project: any) => {
    console.log(
      '🚀 ~ handleFileClick ~ project:',
      project.file.split('/').pop().split('.')[0]
    );
    e.preventDefault();
    try {
      const fileKey =
        project.fileKey || 'uploads/' + project.file.split('/').pop();
      setLoading(true);
      const response = await fetch(`/api/files/${encodeURIComponent(fileKey)}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      // Ouvrir le fichier dans un nouvel onglet
      window.open(data.url, '_blank');
    } catch (error) {
      showAlert({
        message: "Erreur lors de l'accès au fichier",
        variant: 'destructive',
        onClose: () => setLoading(false),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='p-4'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center'>
          <FileText className='h-4 w-4 mr-2' />
          <a
            href='#'
            onClick={(e) => handleFileClick(e, project)}
            className='hover:underline'
          >
            {project.name}
          </a>
        </div>
        <div className='flex items-center gap-2'>
          {loading && <Loader2 className='h-4 w-4 animate-spin' />}
          <Button
            variant='ghost'
            size='icon'
            className='text-red-600'
            onClick={onDelete}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
