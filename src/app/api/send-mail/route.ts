import HelloEmail from "@/components/emails/HelloMail";
import WelcomeEmail from "@/components/emails/Welcome";
import { handleEmailFire as sendMail } from "@/lib/send-mail";
import { render } from "@react-email/render";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("🚀 ~ POST ~ body:", body)

  /* const res = await sendMail({
    recipient: body.email,
    subject: 'Bonjour - Senegal Vision 2050',
    html: (await render(HelloEmail())).toString(),
  });

  if (res?.rejected && res?.rejected?.length > 0) {
    return NextResponse.json({ status: 'error', message: res.response });
  } */

  await sendMail({
    to: body.email,
    subject: "👋 - Validation Compte",
    html: await render(WelcomeEmail({ password: 'vh&389HD' })),
  });

  return NextResponse.json({ status: 'success' });

}