import connect from "___src/lib/db";
import User from "___src/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  await connect();
  const users = await User.find({ role: 'USER' });
  return NextResponse.json({ users });
}