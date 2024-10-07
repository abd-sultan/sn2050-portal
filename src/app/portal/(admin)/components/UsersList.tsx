'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function UsersList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sector, setSector] = useState('all');
  const [status, setStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Exemple de données d'utilisateurs
  const users = [
    {
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      sector: 'Tech',
      status: 'Validé',
    },
    {
      id: 2,
      name: 'Bob',
      email: 'bob@example.com',
      sector: 'Finance',
      status: 'En attente',
    },
    // ... plus d'utilisateurs
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (sector === 'all' || user.sector === sector) &&
      (status === 'all' || user.status === status)
  );

  const handleSendEmail = (user: any) => {
    setSelectedUser(user);
    setShowEmailForm(true);
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
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className='md:w-1/4'>
            <SelectValue placeholder="Secteur d'activité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tous les secteurs</SelectItem>
            <SelectItem value='Tech'>Tech</SelectItem>
            <SelectItem value='Finance'>Finance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className='md:w-1/4'>
            <SelectValue placeholder="Statut d'inscription" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tous les statuts</SelectItem>
            <SelectItem value='Validé'>Validé</SelectItem>
            <SelectItem value='En attente'>En attente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow className='bg-secondary'>
            <TableHead className='text-secondary-foreground'>Nom</TableHead>
            <TableHead className='text-secondary-foreground'>Email</TableHead>
            <TableHead className='text-secondary-foreground'>Secteur</TableHead>
            <TableHead className='text-secondary-foreground'>Statut</TableHead>
            <TableHead className='text-secondary-foreground'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.sector}</TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleSendEmail(user)}
                  variant='secondary'
                >
                  Envoyer un email
                </Button>
              </TableCell>
            </TableRow>
          ))}
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
          disabled={filteredUsers.length < 10}
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
