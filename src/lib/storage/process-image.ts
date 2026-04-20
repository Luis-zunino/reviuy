import 'server-only';
import sharp from 'sharp';

interface ProcessImageInput {
  buffer: Buffer;
  filename: string;
  maxWidth?: number;
  quality?: number;
}

interface ProcessImageOutput {
  buffer: Buffer;
  filename: string;
  contentType: 'image/webp';
}

const DEFAULT_MAX_WIDTH = 2560;
const DEFAULT_QUALITY = 85;

export async function processImageForUpload(input: ProcessImageInput): Promise<ProcessImageOutput> {
  const processedBuffer = await sharp(input.buffer)
    .rotate()
    .resize({
      width: input.maxWidth ?? DEFAULT_MAX_WIDTH,
      height: input.maxWidth ?? DEFAULT_MAX_WIDTH,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality: input.quality ?? DEFAULT_QUALITY,
      effort: 5,
    })
    .toBuffer();

  const safeFilename = input.filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-');
  const outputFilename = `${safeFilename || 'image'}.webp`;

  return {
    buffer: processedBuffer,
    filename: outputFilename,
    contentType: 'image/webp',
  };
}
