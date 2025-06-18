import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface ThankYouEmailProps {
  name?: string;
  message?: string;
}

const baseUrl = process.env.APP_URL || 'http://localhost:3000';

export const ThankYouEmail = ({ name = '', message = '' }: ThankYouEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Merci pour votre message - Senegal Vision 2050</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: '#2250f4',
                offwhite: '#fafbfb',
              },
              spacing: {
                0: '0px',
                20: '20px',
                45: '45px',
              },
            },
          },
        }}
      >
        <Body className='bg-offwhite text-base font-sans'>
          <Container className='bg-[#F6F6F6]'>
            <Img
              src={`${baseUrl}/images/logo-sn2050.jpg`}
              width='184'
              height='75'
              alt='SN2050'
              className='mx-auto my-20'
            />
          </Container>
          <Container className='bg-white p-45'>
            <Heading className='text-center my-0 leading-8'>
              Merci pour votre message !
            </Heading>

            <Section>
              <Text className='text-base'>
                Cher(e) {name ? name : 'visiteur'},
              </Text>
              
              <Text className='text-base'>
                Nous vous remercions d'avoir pris contact avec nous. Votre message a bien été reçu et nous vous répondrons dans les meilleurs délais.
              </Text>

              <Text className='text-base'>
                Notre équipe s'engage à traiter toutes les demandes sous 48 heures.
              </Text>

              {message && (
                <Section className='mt-20 p-20 bg-gray-50 rounded-md'>
                  <Text className='text-gray-800 font-medium'>Votre message :</Text>
                  <Text className='text-gray-700 italic'>{message}</Text>
                </Section>
              )}
            </Section>

            <Section className='text-center mt-45'>
              <Link
                className='bg-brand text-white rounded-lg py-3 px-[18px]'
                href={baseUrl}
              >
                Retour au site
              </Link>
            </Section>
          </Container>

          <Container className='mt-20'>
            <Text className='text-center text-gray-400 mb-45'>
              © 2025 Senegal Vision 2050. Tous droits réservés.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ThankYouEmail;
