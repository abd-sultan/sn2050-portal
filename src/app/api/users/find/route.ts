import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await User.find();
  return NextResponse.json({ users });
}