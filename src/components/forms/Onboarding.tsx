'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: 'Ce champ doit contenir au moins 2 caractères.',
  }),
  lastName: z.string().min(2, {
    message: 'Ce champ doit contenir au moins 2 caractères.',
  }),
  email: z.string().email({ message: 'Email invalide.' }),
  phone: z
    .string()
    .min(9, { message: 'Ce champ doit contenir au moins 10 caractères.' }),
  sector: z.string(),
  company: z.string(),
  fonction: z.string(),
});

export default function OnboardingForm({ handleFormState }: any) {
  const [formState, setFormState] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      sector: '',
      company: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values);

    const res = await fetch('/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    console.log('🚀 ~ onSubmit ~ res:', res);

    if (res.ok) {
      setIsLoading(false);
      // form.reset();
    }
    const data = await res.json();
    console.log('🚀 ~ onSubmit ~ res ~ body:', data);
    if (data.status === 'success') {
      form.reset();
    }
    setFormState(data);
    handleFormState(data);
  }

  return (
    <>
      <Form {...form}>
        {(!formState || formState.status !== 'success') && (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full md:w-1/2 p-12 space-y-8'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder='votre nom' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom(s)</FormLabel>
                    <FormControl>
                      <Input placeholder='votre/vos prénom(s)' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*  */}
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='votre adresse mail professionnelle'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input
                        type='tel'
                        placeholder='votre numero de téléphone'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*  */}
              <FormField
                control={form.control}
                name='sector'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de structure</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Choisissez votre type de structure' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='PTFs'>PTFs</SelectItem>
                        <SelectItem value='Gouvernement'>
                          Gouvernement
                        </SelectItem>
                        <SelectItem value='Secteur Privé'>
                          Secteur Privé
                        </SelectItem>
                        <SelectItem value='Banques'>Banques</SelectItem>
                        <SelectItem value='Autres'>Autres</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='company'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la structure</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nom de votre structure/organisation'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*  */}
              <FormField
                control={form.control}
                name='fonction'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fonction</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Type: DG, PCA, Agent, etc.'
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>
                      Type: DG, PCA, Agent, etc.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col flex-1 gap-1 items-center justify-center'>
              <Button
                disabled={isLoading}
                size='lg'
                type='submit'
                className='w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading && (
                  <Loader2
                    className='mr-2 h-4 w-4 animate-spin'
                    aria-label='Loader'
                  />
                )}
                {isLoading ? 'Enregistrement en cours...' : 'Enregistrer'}
              </Button>
              <div className='flex items-center justify-center'>
                <p className='font-serif text-xs'>OU</p>
                <Link href='/signin'>
                  <Button
                    variant='ghost'
                    className='font-urbanist text-xs underline underline-offset-2'
                  >
                    Accéder à mon espace
                  </Button>
                </Link>
              </div>
            </div>
          </form>
        )}
      </Form>
    </>
  );
}
