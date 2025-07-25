import { render } from "@react-email/render";
import { NextResponse } from "next/server";

import { handleEmailFire as sendMail } from "@/lib/send-mail";

import ThankYouEmail from "@/components/emails/ThankYou";
import WelcomeEmail from "@/components/emails/Welcome";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("🚀 ~ POST ~ body:", body);

  try {
    if (body.type === 'contact') {
      // Envoyer une notification par email à l'adresse de contact
      const contactRes = await sendMail({
        to: 'fiisenegal2025@apix.sn',
        subject: `Nouveau message de ${body.name}`,
        html: `
          <h2>Nouveau message</h2>
          <p><strong>Nom:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Message:</strong></p>
          <p>${body.message}</p>
        `,
      });

      // Envoyer un email de remerciement à l'utilisateur
      const thankYouRes = await sendMail({
        to: body.email,
        subject: 'Merci pour votre message - Senegal Vision 2050',
        html: (await render(ThankYouEmail({ name: body.name, message: body.message }))).toString(),
      });

      if (thankYouRes?.rejected && thankYouRes?.rejected?.length > 0) {
        throw new Error('Failed to send thank you email');
      }

      if (contactRes?.rejected && contactRes?.rejected?.length > 0) {
        throw new Error('Failed to send contact email');
      }

      return NextResponse.json({ status: 'success' });
    }
    else if (body.type === 'welcome') {
      // Email de bienvenue existant
      const welcomeRes = await sendMail({
        to: body.email,
        subject: 'Bienvenue - Senegal Vision 2050',
        html: (await render(WelcomeEmail({ password: body.password }))).toString(),
      });

      if (welcomeRes?.rejected && welcomeRes?.rejected?.length > 0) {
        throw new Error('Failed to send welcome email');
      }

      return NextResponse.json({ status: 'success' });
    }

    return NextResponse.json({ status: 'error', message: 'Invalid email type' }, { status: 400 });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json({ status: 'error', message: (error as Error).message }, { status: 500 });
  }
  return NextResponse.json({ status: 'success' });

}