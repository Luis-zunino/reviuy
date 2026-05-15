import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getR2Client } from './r2.client';

export interface UploadImageInput {
  path: string;
  file: Buffer;
  contentType: string;
}

export interface UploadImageResult {
  url: string;
  path: string;
}

export async function uploadImage(input: UploadImageInput): Promise<UploadImageResult> {
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!bucketName || !publicUrl) {
    throw new Error(
      'R2 no está configurado. Verificá que R2_BUCKET_NAME y R2_PUBLIC_URL estén definidos.'
    );
  }

  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: input.path,
      Body: input.file,
      ContentType: input.contentType,
    })
  );

  const url = `${publicUrl.replace(/\/$/, '')}/${input.path}`;

  return { url, path: input.path };
}
