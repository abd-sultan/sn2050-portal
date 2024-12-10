'use client';

import { useState } from 'react';
import { BarChart, Users, FolderKanban } from 'lucide-react';
import Dashboard from '../components/Dashboard';
import UsersList from '../components/UsersList';
import ProjectsList from '../components/ProjectsList';
import { getConnectedUser } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SectorsProjectsManager from '@/app/portal/(admin)/components/SectorsProjectsManager';

export default function Component() {
  const [queryClient] = useState(() => new QueryClient());
  const [activeTab, setActiveTab] = useState('dashboard');
  const user = getConnectedUser();

  /* if (!user) {
    redirect('/signin');
  } */

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UsersList />;
      case 'projects':
        return <SectorsProjectsManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className='flex flex-col min-h-screen w-full'>
        <main className='flex-1 overflow-y-auto p-4 pb-16'>
          {renderContent()}
        </main>
        <nav className='bg-gradient-to-r from-emerald-700 via-yellow-500 to-red-700 text-primary-foreground fixed bottom-0 left-0 right-0 shadow-lg'>
          <ul className='flex justify-around'>
            <li className='flex-1'>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center w-full py-2 ${
                  activeTab === 'dashboard'
                    ? 'text-green-700 bg-white font-bold rounded-r-full'
                    : ''
                }`}
              >
                <BarChart className='h-6 w-6' />
                <span className='text-xs'>Tableau de bord</span>
              </button>
            </li>
            <li className='flex-1'>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex flex-col items-center w-full py-2 ${
                  activeTab === 'users'
                    ? 'text-yellow-600 bg-white font-bold rounded-full'
                    : ''
                }`}
              >
                <Users className='h-6 w-6' />
                <span className='text-xs'>Inscriptions</span>
              </button>
            </li>
            <li className='flex-1'>
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex flex-col items-center w-full py-2 ${
                  activeTab === 'projects'
                    ? 'text-red-700 bg-white rounded-l-full font-bold'
                    : ''
                }`}
              >
                <FolderKanban className='h-6 w-6' />
                <span className='text-xs'>Projets</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </QueryClientProvider>
  );
}
