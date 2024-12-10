import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Sector from '@/models/sector.model';
import { uploadFile } from '@/lib/upload';
import Project from '@/models/project.model';

export async function GET() {
  try {
    await dbConnect();
    const sectors = await Sector.find({}).sort({ createdAt: -1 });

    // Pour chaque secteur, charger ses projets
    const sectorsWithProjects = await Promise.all(sectors.map(async (sector) => {
      const projects = await Project.find({ sector: sector._id }).sort({ createdAt: -1 });
      const sectorObj = sector.toObject();
      return {
        ...sectorObj,
        projects: projects
      };
    }));

    return NextResponse.json(sectorsWithProjects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sectors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const iconFile = formData.get('icon') as File;

    if (!name || !iconFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload l'icône et récupère l'URL
    const iconUrl = await uploadFile(iconFile, 'image');

    const sector = await Sector.create({
      name,
      icon: iconUrl.url,
      iconKey: iconUrl.key
    });

    return NextResponse.json(sector, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create sector' }, { status: 500 });
  }
}