// app/api/files/[key]/route.ts
import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, S3_BUCKET } from '@/lib/s3-config';
import path from 'path';

const CONTENT_TYPES: any = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp'
};

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const decodedKey = decodeURIComponent(params.key);
    const ext = path.extname(decodedKey).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';

    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: decodedKey,
    });

    const response = await s3Client.send(command);
    const chunks = [];

    // Convertir le ReadableStream en Buffer
    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Retourner directement le fichier avec le bon type MIME
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': ext === '.pdf' ? 'inline' : 'inline',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file' },
      { status: 500 }
    );
  }
}