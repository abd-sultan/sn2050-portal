import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { signIn } from "auth";

/* export async function POST(request: Request) {
  const body = await request.json();
  console.log('🚀 ~ POST ~ body:', body);

  const user = await User.findOne({ email: body.email });
  if (!user) {
    return NextResponse.json({ status: 'error', message: 'Utilisateur inexistant' });
  }

  if (user.password !== body.password) {
    return NextResponse.json({ status: 'error', message: 'Email ou mot de passe incorrect' });
  }

  return NextResponse.json({ status: 'success', data: user });
} */

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json();
  const { email, password } = data;

  try {
    const result = await signIn("credentials", { redirect: false, email, password });

    // handle the result of the sign-in attempt
    if (!result || result.error) {
      return NextResponse.json({ error: "Invalid credentials" });
    } else {
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error during sign-in", error);
    return NextResponse.error();
  }
}