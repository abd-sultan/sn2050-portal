import connect from "___src/lib/db";
import ProjectUser from "___src/models/project_user.model";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const users = await ProjectUser.find({ user: id });
  return NextResponse.json({ users });
}