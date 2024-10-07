import connect from "@/lib/db";
import { sendMail } from "@/lib/send-mail";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connect();

  const body = await request.json();
  console.log('🚀 ~ POST ~ body:', body);

  // generate 8 chars password
  body.password = Math.random().toString(36).slice(-8);
  body.role = 'USER';

  try {

    // save to db
    const user = await User.create(body);

    console.log('🚀 ~ POST ~ user:', user);

    /* const response = await sendMail({
      // email: 'no-reply@senegalvision2050.sn',
      email: 'senegal2050@demomailtrap.com',
      sendTo: body.email,
      subject: 'Création compte - Senegal Vision 2050',
      text: `You have a new contact form submission with the following details: Name: ${body.name}, Email: ${body.email}, Message: ${body.message}`,
      html: `<h1>Hello ${body.firstName},</h1><p>You have a new contact form submission with the following details:</p><ul><li>Name: ${body.firstName}</li><li>Email: ${body.email}</li><li>Message: ${body.message}</li></ul>`,
    }); */

    // message: "Merci! Votre demande a bien été enregistrée, nos équipes vous contacteront pour un rendez-vous dans les 48 heures",
    return NextResponse.json({
      status: 'success',
      message: 'Merci! Votre compte a été créé. Vous receverez un email de confirmation avec votre mot de passe après validation votre compte par nos services.',
      data: user
    });
  } catch (error) {
    console.log('🚀 ~ POST ~ error:', error);
    return NextResponse.json({
      status: 'error',
      message: error
    });
  }

}