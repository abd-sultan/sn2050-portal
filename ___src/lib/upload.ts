// lib/upload.ts
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, S3_BUCKET } from './s3-config';
import crypto from 'crypto';
import path from 'path';
import { UploadResult } from '___src/types';
import { validateFile } from '___src/lib/file-validation';

export async function uploadFile(file: File, type: 'image' | 'document'): Promise<UploadResult> {
  // Valider le fichier avant l'upload
  validateFile(file, type);
  try {
    // Générer un nom de fichier unique
    const fileExtension = path.extname(file.name);
    const randomString = crypto.randomBytes(16).toString('hex');
    const key = `uploads/${randomString}${fileExtension}`;

    // Convertir le fichier en Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload direct vers iDrive e2
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Construire l'URL publique du fichier
    const url = `${process.env.IDRIVE_ENDPOINT_URL}/${S3_BUCKET}/${key}`;

    console.log("🚀 ~ uploadFile ~ { url, key }:", { url, key })
    return { url, key };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

export async function deleteFile(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
}

// Fonction utilitaire pour obtenir une URL signée pour la lecture (optionnel)
export async function getSignedReadUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}