'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const [formData, setFormData] = React.useState<any>({});
  const [authenticated, setAuthenticated] = React.useState(false);
  const [error, setError] = React.useState<any | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [authSuccess, setAuthSuccess] = React.useState(true);
  const [tokenStatus, setTokenStatus] = React.useState(false);

  React.useEffect(() => {
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
        // Redirect to previous page or home page
        const next = searchParams.get('next') || '/portal';
        router.push(next);
      } else {
        router.push('/signin');
      }
    }
  }, [tokenStatus, authSuccess]);
  const credentialsAction = async () => {
    console.log('🚀 ~ credentialsAction ~ formData:', formData);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('🚀 ~ credentialsAction ~ res:', res);
      if (res.ok) {
        setTokenStatus(true);
      } else {
        // handle error state here
        setAuthSuccess(false);
      }
    } catch (error) {
      console.log('🚀 ~ credentialsAction ~ error:', error);
      // handle error state here
      setAuthSuccess(false);
    }
  };

  return (
    <form
      action={credentialsAction}
      className='w-full h-screen flex items-center justify-center'
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
          <Button type='submit' variant='default' className='w-full'>
            Se Connecter
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
