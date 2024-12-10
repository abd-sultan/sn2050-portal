import { NextResponse } from 'next/server';
import dbConnect from '___src/lib/db';
import Sector from '___src/models/sector.model';
import { uploadFile } from '___src/lib/upload';
import Project from '___src/models/project.model';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const sector = await Sector.findById(params.id);

    if (!sector) {
      return NextResponse.json({ error: 'Sector not found' }, { status: 404 });
    }

    return NextResponse.json(sector);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sector' }, { status: 500 });
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
    const iconFile = formData.get('icon') as File | null;

    const updateData: { name?: string; icon?: string } = {};
    if (name) updateData.name = name;

    if (iconFile) {
      const iconUrl = await uploadFile(iconFile, 'image');
      updateData.icon = iconUrl.url;
    }

    const sector = await Sector.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    if (!sector) {
      return NextResponse.json({ error: 'Sector not found' }, { status: 404 });
    }

    return NextResponse.json(sector);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update sector' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const sector = await Sector.findByIdAndDelete(params.id);

    if (!sector) {
      return NextResponse.json({ error: 'Sector not found' }, { status: 404 });
    }

    // Supprimez également tous les projets associés
    await Project.deleteMany({ sector: params.id });

    return NextResponse.json({ message: 'Sector deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete sector' }, { status: 500 });
  }
}