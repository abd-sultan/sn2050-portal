'use client';

import InfoRequestsLineChart from '@/app/portal/(admin)/components/charts/InformationRequest';
import ProjectDistributionPieChart from '@/app/portal/(admin)/components/charts/ProjectDistribution';
import RegistrationsBarChart from '@/app/portal/(admin)/components/charts/Registrations';
import RequestStatusStackedBarChart from '@/app/portal/(admin)/components/charts/RequestStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  LineChart,
  Users,
  FolderKanban,
  MailCheck,
  UserCheck2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  // const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    const res = await fetch('/api/dashboard/home').then((res) => res.json());

    console.log('🚀 ~ fetchData ~ res:', res);
    return res;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fetchData', 'dashboard'],
    queryFn: fetchData,
  });

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
            <div className='text-2xl font-bold'>{data?.count_users || 0}</div>
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
            <div className='text-2xl font-bold'>
              {data?.count_projects || 0}
            </div>
          </CardContent>
        </Card>
        <Card className='bg-secondary text-secondary-foreground'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Compte Utilisateur Validé
            </CardTitle>
            <UserCheck2 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {data?.count_valide_users || 0}
            </div>
          </CardContent>
        </Card>
        <Card className='bg-secondary text-secondary-foreground'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Utilisateur contacté
            </CardTitle>
            <MailCheck className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {data?.count_valide_projects || 0}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        <RegistrationsBarChart />
        <ProjectDistributionPieChart />
        <InfoRequestsLineChart />
        <RequestStatusStackedBarChart />
      </div>
    </div>
  );
}
