import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  steps?: {
    id: number;
    Description: React.ReactNode;
  }[];
  links?: string[];
}

const baseUrl = process.env.APP_URL || 'http://localhost:3000';

const PropDefaults: WelcomeEmailProps = {
  steps: [
    {
      id: 1,
      Description: (
        <li className='mb-20' key={1}>
          <strong>Connectez-vous</strong>{' '}
          <Link href={`${baseUrl}/signin`}>Connectez-vous</Link> à votre espace
          avec les accés email et mot de passe fournis (à la fin de ce mail).
        </li>
      ),
    },
    {
      id: 2,
      Description: (
        <li className='mb-20' key={2}>
          <strong>Les secteurs</strong> Choisissez parmis les nombreux secteurs
          d'activité.
        </li>
      ),
    },
    {
      id: 3,
      Description: (
        <li className='mb-20' key={3}>
          <strong>Les Projets</strong> Choisissez un projet par rapport au
          secteur selectionné précedemment.
        </li>
      ),
    },
    {
      id: 4,
      Description: (
        <li className='mb-20' key={4}>
          <strong>Aller plus loin</strong> Demander plus d'informations sur le
          projet qui vous intéresse; nos équipes se chargent de vous contacter
          dans les 48h afin de vous accompagner.
        </li>
      ),
    },
  ],
  links: ['Visiter le site', 'Présidence', 'Apix'],
};

export const WelcomeEmail = ({ password }: any) => {
  return (
    <Html>
      <Head />
      <Preview>Inscription - Senegal Vision 2050</Preview>
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
              Bienvenue !
            </Heading>

            <Section>
              <Row>
                <Text className='text-base'>
                  Félicitations! Votre compte a été validé ce qui vous donne
                  accès à tous les projets dans différents secteurs d'activité.
                </Text>

                <Text className='text-base'>Voici comment procéder:</Text>
              </Row>
            </Section>

            <ul>{PropDefaults.steps?.map(({ Description }) => Description)}</ul>

            <Section className='text-center'>
              <Link
                className='bg-brand text-white rounded-lg py-3 px-[18px]'
                href={`${baseUrl}/signin`}
              >
                Voir les projets
              </Link>
            </Section>

            {/* <Section className='mt-45'>
              <Row>
                {PropDefaults.links?.map((link) => (
                  <Column key={link}>
                    <Link className='text-black underline font-bold'>
                      {link}
                    </Link>{' '}
                    <span className='text-green-500'>→</span>
                  </Column>
                ))}
              </Row>
            </Section> */}
            {password !== '' && (
              <Section className='mt-45' style={verificationSection}>
                <Text style={verifyText}>Mot de passe</Text>

                <Text style={codeText}>{password}</Text>
                <Text style={validityText}>
                  (Veillez à bien conserver votre mot de passe)
                </Text>
              </Section>
            )}
          </Container>

          {/* <Container className='mt-20'>
            <Section>
              <Row>
                <Column className='text-right px-20'>
                  <Link>Unsubscribe</Link>
                </Column>
                <Column className='text-left'>
                  <Link>Manage Preferences</Link>
                </Column>
              </Row>
            </Section>
            <Text className='text-center text-gray-400 mb-45'>
              Netlify, 44 Montgomery Street, Suite 300 San Francisco, CA
            </Text>
          </Container> */}
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;

const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0',
};

const verifyText = {
  ...text,
  margin: 0,
  fontWeight: 'bold',
  textAlign: 'center' as const,
};

const codeText = {
  ...text,
  fontWeight: 'bold',
  fontSize: '36px',
  margin: '10px 0',
  textAlign: 'center' as const,
};

const validityText = {
  ...text,
  margin: '0px',
  textAlign: 'center' as const,
};

const verificationSection = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
