import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, Users, FolderKanban } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className='space-y-4 w-full'>
      <h1 className='text-2xl font-bold text-primary'>Tableau de bord</h1>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='bg-secondary text-secondary-foreground'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Nombre d'inscrits
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>1,234</div>
          </CardContent>
        </Card>
        <Card className='bg-secondary text-secondary-foreground'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Projets visités
            </CardTitle>
            <FolderKanban className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>567</div>
          </CardContent>
        </Card>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-primary'>
              Inscriptions par secteur d'activité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart className='h-[200px] w-full text-primary' />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='text-primary'>Visites par projet</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart className='h-[200px] w-full text-primary' />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
