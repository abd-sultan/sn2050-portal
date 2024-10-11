import connect from "@/lib/db";
import ProjectUser from "@/models/project_user.model";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  connect();

  try {
    // count users
    const users = await User.find({ role: 'USER' });
    const valideUsers = await User.find({ role: 'USER', status: 'valide' });
    console.log("🚀 ~ GET ~ users:", users)

    // count projects
    const projects = await ProjectUser.find();
    const valideProjects = await ProjectUser.find({ status: 'valide' });

    return NextResponse.json({ count_users: users.length, count_projects: projects.length, count_valide_users: valideUsers.length, count_valide_projects: valideProjects.length });

  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error)
    return NextResponse.json({ status: 'error', message: 'Une erreur est survenue' });
  }
}