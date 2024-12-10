'use client';

import { useState } from 'react';
import { Button } from '___src/components/ui/button';
import { Input } from '___src/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '___src/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '___src/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, CheckSquare2, MailOpen } from 'lucide-react';
import Link from 'next/link';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const MySwal = withReactContent(Swal);

export default function UsersList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sector, setSector] = useState('all');
  const [status, setStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUser, setFilteredUser] = useState([]);

  // Exemple de données d'utilisateurs
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users/find');
      const data = await response.json();
      console.log('🚀 ~ queryFn: ~ data:', data.users);
      setFilteredUser(data.users);
      return data.users;
    },
  });

  /* const filteredUsers = users.filter(
    (user: any) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (sector === 'all' || user.sector === sector) &&
      (status === 'all' || user.status === status)
  ); */

  const handleSendEmail = (user: any) => {
    setSelectedUser(user);
    setShowEmailForm(true);
  };

  const handleValidate = async (id: any) => {
    const res = await fetch('/api/users/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    console.log('🚀 ~ handleValidate ~ data:', data);

    if (data.status === 'success') {
      MySwal.fire({
        title: 'Un mail de validation a été envoyé!',
        icon: 'success',
        confirmButtonText: 'Fermer',
        confirmButtonColor: 'green',
        customClass: {
          container: 'bg-flag-green text-white',
        },
      });
    }
  };

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold text-primary'>Liste des inscrits</h1>
      <div className='flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0'>
        <Input
          placeholder='Rechercher un utilisateur'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='md:w-1/3'
        />
        {/* <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className='md:w-1/4'>
            <SelectValue placeholder="Secteur d'activité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tous les secteurs</SelectItem>
            <SelectItem value='Tech'>Tech</SelectItem>
            <SelectItem value='Finance'>Finance</SelectItem>
          </SelectContent>
        </Select> */}
        {/* <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className='md:w-1/4'>
            <SelectValue placeholder="Statut d'inscription" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tous les statuts</SelectItem>
            <SelectItem value='Validé'>Validé</SelectItem>
            <SelectItem value='En attente'>En attente</SelectItem>
          </SelectContent>
        </Select> */}
      </div>
      <Table>
        <TableHeader>
          <TableRow className='bg-secondary'>
            <TableHead className='text-secondary-foreground'>Nom</TableHead>
            <TableHead className='text-secondary-foreground'>Email</TableHead>
            <TableHead className='text-secondary-foreground'>Secteur</TableHead>
            <TableHead className='text-secondary-foreground'>
              Organisation
            </TableHead>
            <TableHead className='text-secondary-foreground'>Statut</TableHead>
            <TableHead className='text-secondary-foreground text-right'>
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.length > 0 ? (
            users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>
                  <b>{user.lastName.toString().toUpperCase()}</b>{' '}
                  {user.firstName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.sector}</TableCell>
                <TableCell>{user.company}</TableCell>
                <TableCell>
                  {user.status === 'en_attente' ? (
                    <p className='uppercase text-center font-bold text-amber-600 w-full bg-amber-100 px-4 py-2 rounded-xl'>
                      En attente
                    </p>
                  ) : (
                    <p className='uppercase text-center font-bold text-emerald-600 w-full bg-emerald-100 px-4 py-2 rounded-xl'>
                      Vérifié
                    </p>
                  )}
                </TableCell>
                <TableCell className='text-right flex gap-2 items-center justify-end'>
                  <Button
                    onClick={() => handleValidate(user._id)}
                    variant='link'
                    className='cursor-pointer'
                  >
                    <CheckCircle2 className='text-flag-green' />
                  </Button>
                  <Link href={`mailto:${user.email}`}>
                    <MailOpen className='text-primary' />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className='text-center'>
                {isLoading
                  ? 'Chargement...'
                  : `Pas d'utilisateur correspondant ${users.length}`}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className='flex justify-center space-x-2'>
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant='outline'
        >
          Précédent
        </Button>
        <Button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={users?.length < 10}
          variant='outline'
        >
          Suivant
        </Button>
      </div>
      {showEmailForm && (
        <EmailForm
          user={selectedUser}
          onClose={() => setShowEmailForm(false)}
        />
      )}
    </div>
  );
}

function EmailForm({ user, onClose }: any) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    window.location.href = `mailto:${user.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-background p-4 rounded-lg w-full max-w-md'>
        <h2 className='text-xl font-bold mb-4 text-primary'>
          Envoyer un email à {user.name}
        </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            placeholder='Sujet'
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <textarea
            placeholder='Corps du message'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className='w-full h-32 p-2 border rounded'
          />
          <div className='flex justify-end space-x-2'>
            <Button type='button' onClick={onClose} variant='outline'>
              Annuler
            </Button>
            <Button type='submit'>Envoyer</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
