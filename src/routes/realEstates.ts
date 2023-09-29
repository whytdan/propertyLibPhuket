import express from 'express';
import dotenv from 'dotenv';
import {
  RealEstate,
  RealEstateSchema,
  IRealEstate,
} from '../models/RealEstate.js';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config();

const s3ClientParams = { region: process.env.AWS_REGION };
const s3Client = new S3Client(s3ClientParams);

const router = express.Router();

/* GET realEstates listing. */
router.get('/', async function (req, res) {
  try {
    const query: Partial<IRealEstate> & { _page?: number; _limit?: number } =
      {};

    // Get the list of fields from the schema
    const allowedFields = Object.keys(RealEstateSchema.paths);

    // Filter by query parameters
    for (const [key, value] of Object.entries(req.query)) {
      if (
        allowedFields.includes(key) &&
        key !== '_page' &&
        key !== '_limit' &&
        typeof value === 'string'
      ) {
        (query as any)[key] = value;
      }
    }

    // Pagination
    const page = parseInt(req.query._page as string) || 1;
    const limit = parseInt(req.query._limit as string) || 10;
    const skip = (page - 1) * limit;
    const realEstates = await RealEstate.find(query).skip(skip).limit(limit);

    const realEstatesWithDecryptedImagesPromises = realEstates.map(
      async (realEstate) => {
        const mainImageParams = {
          Bucket: realEstate.mainImage.bucket,
          Key: realEstate.mainImage.s3Key,
        };

        const command = new GetObjectCommand(mainImageParams);
        const url = await getSignedUrl(s3Client, command);

        return {
          ...realEstate.toObject(),
          mainImage: url,
        };
      }
    );

    const realEstatesWithDecryptedImages = await Promise.all(
      realEstatesWithDecryptedImagesPromises
    );

    res.json(realEstatesWithDecryptedImages);
  } catch (error) {
    console.error(`error in realEstates: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* GET realEstate by id */
router.get('/:id', function (req, res) {});

/* POST realEstate creation */
router.post('/', function (req, res) {});

/* PATCH updating realEstate */
router.patch('/:id', function (req, res) {});

/* DELETE updating realEstate */
router.delete('/:id', function (req, res) {});

export default router;
