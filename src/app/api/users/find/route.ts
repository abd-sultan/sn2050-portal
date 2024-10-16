import connect from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  await connect();
  const users = await User.find({ role: 'USER' });
  return NextResponse.json({ users });
}