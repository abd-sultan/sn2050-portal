import { handleEmailFire as sendMail } from '@/lib/send-mail';
import connect from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import { render } from '@react-email/render';
import WelcomeEmail from '@/components/emails/Welcome';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  await connect();

  const body = await request.json();

  // generate 8 chars password
  const password = Math.random().toString(36).slice(-8);
  // hashed password
  // body.password = bcrypt.hashSync(password, 10);
  // // set default role
  // body.role = 'USER';
  // body.status = 'en_attente';

  try {

    const payload = { ...body, password: bcrypt.hashSync(password, 10), role: 'USER', status: 'valide' };

    // check if user already exists
    const userExists = await User.findOne({ email: body.email });
    if (userExists) {
      return NextResponse.json({
        status: 'error',
        message: 'Cet Utilisateur existe déjà!'
      });
    }

    // save to db
    const user = await User.create(payload);

    await sendMail({
      to: user.email,
      subject: "Validation Compte ✅",
      html: await render(WelcomeEmail({ password })),
    });

    // message: "Merci! Votre demande a bien été enregistrée, nos équipes vous contacteront pour un rendez-vous dans les 48 heures",
    return NextResponse.json({
      status: 'success',
      message: 'Merci! Votre compte a été créé. Vous receverez un email de confirmation avec votre mot de passe après validation votre compte par nos services.',
      data: user
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error
    });
  }

}