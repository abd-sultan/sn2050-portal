import { NextResponse } from 'next/server';
import dbConnect from '___src/lib/db';
import Project from '___src/models/project.model';
import Sector from '___src/models/sector.model';
import { uploadFile } from '___src/lib/upload';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const project = await Project.findById(params.id).populate('sector');

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const sectorId = formData.get('sector') as string;
    const projectFile = formData.get('file') as File | null;

    const updateData: { name?: string; sector?: string; file?: string } = {};
    if (name) updateData.name = name;
    if (sectorId) {
      // Vérifie si le secteur existe
      const sector = await Sector.findById(sectorId);
      if (!sector) {
        return NextResponse.json({ error: 'Sector not found' }, { status: 404 });
      }
      updateData.sector = sectorId;
    }

    if (projectFile) {
      const fileUrl = await uploadFile(projectFile, 'document');
      updateData.file = fileUrl.url;
    }

    const project = await Project.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    ).populate('sector');

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const project = await Project.findByIdAndDelete(params.id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}