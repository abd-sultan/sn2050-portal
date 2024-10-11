import { projects } from "@/constant/sectors";
import connect from "@/lib/db";
import ProjectUser from "@/models/project_user.model";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("🚀 ~ POST ~ request:", request)
  await connect();

  const body = await request.json();
  console.log("🚀 ~ POST ~ body:", body)

  try {
    const user = await User.findById(body.userId);
    if (!user) {
      return NextResponse.json({ status: 'error', message: 'Utilisateur inexistant' });
    }

    /* const project = await Project.findById(body.projectId);
    if (!project) {
      return NextResponse.json({ status: 'error', message: 'Projet inexistant' });
    } */

    // check if already in favs
    const projectUser = await ProjectUser.findOne({ project: body.projectId, user: user._id });
    if (projectUser) {
      return NextResponse.json({ status: 'error', message: 'Nous avons déjà reçu votre demande pour ce projet. Nos équipes vous contacteront pour un rendez-vous dans les 48 heures.' });
    }

    // save to db
    await ProjectUser.create({ project: body.projectId, user: user._id, status: 'en_attente' });

    const message = "Merci! Votre demande a bien été enregistrée, nos équipes vous contacteront pour un rendez-vous dans les 48 heures";

    return NextResponse.json({ status: 'success', message });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 'error', message: 'Une erreur est survenue' });
  }
}

export async function GET() {
  await connect();
  const result = await ProjectUser.find();
  const data = []
  for (const item of result) {
    let res: any;
    const user = await User.findById(item.user);
    if (user) {
      res.user = user;
    }
    const project = projects.find((p: any) => {
      Object.values(p).find((x: any) => x.id === item.project);
    });
    if (project) {
      res.project = project;
    }
    data.push(res);
  }
  return NextResponse.json({ data });
}