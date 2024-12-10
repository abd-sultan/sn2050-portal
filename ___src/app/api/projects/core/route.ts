import { NextResponse } from 'next/server';
import dbConnect from '___src/lib/db';
import Project from '___src/models/project.model';
import { uploadFile } from '___src/lib/upload';
import Sector from '___src/models/sector.model';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const sectorId = searchParams.get('sector');

    const query = sectorId ? { sector: sectorId } : {};
    const projects = await Project.find(query).populate('sector').sort({ createdAt: -1 });

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const sectorId = formData.get('sector') as string;
    const projectFile = formData.get('file') as File;

    if (!name || !sectorId || !projectFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Vérifie si le secteur existe
    const sector = await Sector.findById(sectorId);
    if (!sector) {
      return NextResponse.json({ error: 'Sector not found' }, { status: 404 });
    }

    // Upload le fichier et récupère l'URL
    const { url: fileUrl, key: fileKey } = await uploadFile(projectFile, 'document');

    console.log("🚀 ~ POST ~ project:", fileKey)
    const project = await Project.create({
      name,
      file: fileUrl,
      fileKey: fileKey,
      sector: sectorId,
    });

    // Convertir le document Mongoose en objet simple
    const projectObj = project.toObject();

    return NextResponse.json(projectObj, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}