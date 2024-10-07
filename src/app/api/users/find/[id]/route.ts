import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const user = await User.findById(id);
  return NextResponse.json({ user });
}