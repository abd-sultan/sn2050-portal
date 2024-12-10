'use client';

import React, { useEffect } from 'react';
import { Button } from '___src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '___src/components/ui/card';
import { Input } from '___src/components/ui/input';
import { Label } from '___src/components/ui/label';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginForm() {
  const [formData, setFormData] = React.useState<any>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [error, setError] = React.useState<any | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [authSuccess, setAuthSuccess] = React.useState(true);
  const [tokenStatus, setTokenStatus] = React.useState(false);

  React.useEffect(() => {
    console.log('🚀 ~ useEffect:', tokenStatus, authSuccess);
    // check query string for authentication code
    if (authSuccess || tokenStatus) {
      const url = window.location.href;
      const code = url.match(/\?code=(.*)/);
      if (!tokenStatus && authSuccess) {
        if (code) {
          credentialsAction();
        } else {
          router.push('/signin');
        }
      } else if (tokenStatus) {
        console.log(
          '🚀 ~ React.useEffect ~ authSuccess:',
          tokenStatus,
          authSuccess
        );
        // Redirect to previous page or home page
        // const next = searchParams.get('next') || '/portal';
        // Redirection après une connexion réussie
        router.push('/portal/sectors');
      } else {
        router.push('/signin');
      }
    }
  }, [tokenStatus, authSuccess]);
  const credentialsAction = async () => {
    console.log('🚀 ~ credentialsAction ~ formData:', formData);

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log('🚀 ~ credentialsAction ~ res:', data);
      if (res.ok || data?.success) {
        console.log('🚀 ~ res.ok || data?.success:', res);
        localStorage.setItem('token', btoa(JSON.stringify(data?.user)));
        setTokenStatus(true);
        setAuthSuccess(true);
        setIsLoading(false);
      } else {
        // handle error state here
        setAuthSuccess(false);
        setIsLoading(false);
        setError(data?.message);
      }
    } catch (error) {
      console.log('🚀 ~ credentialsAction ~ error:', error);
      setError('Email ou mot de passe incorrect');
      // handle error state here
      setAuthSuccess(false);
      setIsLoading(false);
    }
  };

  // Exécuter lors de la connexion
  /* useEffect(() => {
    if (status === 'authenticated' && session) {
      // Redirige selon le rôle de l'utilisateur
      router.push('/portal/sectors');
    }
  }, [status, session]); */

  return (
    <form
      action={credentialsAction}
      className='w-full h-screen flex items-center justify-center bg-[#F6F6F6]'
    >
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>Connexion</CardTitle>
          <CardDescription>
            Saisissez votre adresse électronique ci-dessous pour vous connecter
            à votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          {error && <p className='text-red-500'>{error}</p>}
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              name='email'
              placeholder='m@example.com'
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='password'>Mot de passe</Label>
            <Input
              id='password'
              type='password'
              name='password'
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            disabled={isLoading}
            type='submit'
            variant='default'
            className='w-full  disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading && (
              <Loader2
                className='mr-2 h-4 w-4 animate-spin'
                aria-label='Loader'
              />
            )}
            {isLoading ? 'Connexion en cours...' : 'Se Connecter'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
