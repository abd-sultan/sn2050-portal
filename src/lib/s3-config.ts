// lib/s3-config.ts
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3Client = new S3Client({
  region: 'paris', // iDrive e2 utilise us-east-1
  endpoint: process.env.IDRIVE_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.IDRIVE_ACCESS_KEY!,
    secretAccessKey: process.env.IDRIVE_SECRET_KEY!,
  },
  forcePathStyle: true // Nécessaire pour les fournisseurs S3 compatibles
});

export const S3_BUCKET = process.env.IDRIVE_BUCKET_NAME!;

export async function getSignedFileUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
  });

  // L'URL sera valide pendant 1 heure
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}