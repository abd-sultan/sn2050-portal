import { handleEmailFire as sendMail } from '___src/lib/send-mail';
import connect from "___src/lib/db";
import User from "___src/models/user.model";
import { NextResponse } from "next/server";
import { render } from '@react-email/render';
import WelcomeEmail from '___src/components/emails/Welcome';

export async function POST(request: Request) {
  await connect();

  const body = await request.json();

  const user = await User.findById(body.id);

  if (!user) {
    return NextResponse.json({ status: 'error', message: 'Utilisateur inexistant' });
  }

  user.status = 'valide';
  await user.save();

  await sendMail({
    to: user.email,
    subject: "Validation Compte ✅",
    html: await render(WelcomeEmail({ password: user.password })),
  });

  return NextResponse.json({ status: 'success' });

}