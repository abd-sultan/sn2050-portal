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
});

export default function OnboardingForm({ handleFormState }: any) {
  const [formState, setFormState] = React.useState<any>(null);

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
      form.reset();
    }
    const data = await res.json();
    console.log('🚀 ~ onSubmit ~ res ~ body:', data);
    setFormState(data);
    handleFormState(data);
  }

  return (
    <>
      <Form {...form}>
        {!formState && (
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
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Type: PTFs, Gouvernement, Secteur privé, banques, etc.
                    </FormDescription>
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col flex-1 gap-1 items-center justify-center'>
              <Button size='lg' type='submit' className='w-full md:w-auto'>
                Enregistrer
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
