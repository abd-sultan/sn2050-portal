import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '___src/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '___src/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { BarChart, MailOpen, PieChart } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsList() {
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/users/find');
      const data = await response.json();
      console.log('🚀 ~ queryFn: ~ data:', data);
      return data.data;
    },
  });

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold text-primary'>
        Projets et Statistiques
      </h1>
      {/* <div className='grid gap-4 md:grid-cols-2'>
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
      </div> */}
      <Table>
        <TableHeader>
          <TableRow className='bg-secondary'>
            <TableHead className='text-secondary-foreground'>
              Nom du projet
            </TableHead>
            <TableHead className='text-secondary-foreground'>Secteur</TableHead>
            <TableHead className='text-secondary-foreground'>
              Investisseur
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length > 0 &&
            data.map((item: any) => (
              <TableRow key={item.project.id}>
                <TableCell>{item?.project?.nom}</TableCell>
                <TableCell>
                  {item?.user?.firstName} {item?.user?.laststName}
                </TableCell>
                <TableCell>
                  <Link href={`mailto:${item.user.email}`}>
                    <MailOpen className='text-primary' />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
