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
          Key: realEstate.mainImage.key,
        };

        const mainImageCommand = new GetObjectCommand(mainImageParams);
        const mainImageUrl = await getSignedUrl(s3Client, mainImageCommand);

        const decryptedImagesPromises = realEstate?.images?.key?.length
          ? realEstate.images.key.map(async (key) => {
              if (key) {
                const imageParams = {
                  Bucket: process.env.AWS_BUCKET,
                  Key: key,
                };

                const command = new GetObjectCommand(imageParams);
                const url = await getSignedUrl(s3Client, command);

                return {
                  url,
                };
              } else {
                return {
                  url: '',
                };
              }
            })
          : [];

        const realEstateImages = await Promise.all(decryptedImagesPromises);

        return {
          ...realEstate.toObject(),
          mainImage: {
            url: mainImageUrl,
            // alt: realEstate.mainImage.alt,
          },
          images: realEstateImages,
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
