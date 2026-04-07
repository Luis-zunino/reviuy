import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getR2Client } from './r2.client';

export async function deleteImage(path: string): Promise<void> {
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!bucketName) {
    throw new Error('R2 no está configurado. Verificá que R2_BUCKET_NAME esté definido.');
  }

  const client = getR2Client();

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: path,
    })
  );
}
