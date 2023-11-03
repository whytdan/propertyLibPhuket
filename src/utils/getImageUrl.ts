
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../env.js';

const s3ClientParams = { region: env.AWS_REGION };
const s3Client = new S3Client(s3ClientParams);

export const getImageUrl = async (key: string): Promise<string | null> => {
  try {
    const imageParams = {
      Bucket: env.AWS_BUCKET,
      Key: key,
    };

    const command = new GetObjectCommand(imageParams);
    const url = await getSignedUrl(s3Client, command).catch((error) => {
      return null;
    });

    return url;
  } catch (error) {
    return null;
  }
}
