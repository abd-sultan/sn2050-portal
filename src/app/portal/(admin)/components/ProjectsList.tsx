import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, PieChart } from 'lucide-react';

export default function ProjectsList() {
  // Exemple de données de projets
  const projects = [
    { id: 1, name: 'Projet A', sector: 'Tech', visits: 150 },
    { id: 2, name: 'Projet B', sector: 'Finance', visits: 80 },
    // ... plus de projets
  ];

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold text-primary'>
        Projets et Statistiques
      </h1>
      <div className='grid gap-4 md:grid-cols-2'>
        <Card className='bg-secondary text-secondary-foreground'>
          <CardHeader>
            <CardTitle>Projets par secteur</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart className='h-[200px] w-full' />
          </CardContent>
        </Card>
        <Card className='bg-secondary text-secondary-foreground'>
          <CardHeader>
            <CardTitle>Projets les plus consultés</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart className='h-[200px] w-full' />
          </CardContent>
        </Card>
      </div>
      <Table>
        <TableHeader>
          <TableRow className='bg-secondary'>
            <TableHead className='text-secondary-foreground'>
              Nom du projet
            </TableHead>
            <TableHead className='text-secondary-foreground'>Secteur</TableHead>
            <TableHead className='text-secondary-foreground'>
              Nombre de visites
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.sector}</TableCell>
              <TableCell>{project.visits}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
