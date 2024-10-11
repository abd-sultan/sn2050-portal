import { handleEmailFire as sendMail } from '@/lib/send-mail';
import connect from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import { render } from '@react-email/render';
import WelcomeEmail from '@/components/emails/Welcome';

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