import express from 'express';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  IRealEstate,
  RealEstate,
  RealEstateSchema,
} from '../models/RealEstate.js';
import { env } from '../env.js';
import { FilterQuery } from 'mongoose';

const s3ClientParams = { region: env.AWS_REGION };
const s3Client = new S3Client(s3ClientParams);

const router = express.Router();

/* GET realEstates wirh priority listing. */
router.get('/', async function (req, res) {
  try {
    const query: FilterQuery<IRealEstate> & {
      _page?: number;
      _limit?: number;
      // [key: string]: any;
    } = {};

    // Get the list of fields from the schema
    const allowedFields = Object.keys(RealEstateSchema.paths);

    // Filter by query parameters
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value !== 'string') continue;

      const baseField = key.replace(/_(gte|lte)$/, ''); // Extract base field name

      if (allowedFields.includes(baseField)) {
        // Check for special filters like _gte and _lte
        if (key.startsWith('price')) {
          if (key === 'price_gte') {
            query.priceMillionBahtFrom = { $gte: value };
          }
          if (key === 'price_lte') {
            query.priceMillionBahtTo = { $lte: value };
          }
        }
        else if (key.endsWith('_gte')) {
          if (!query[baseField]) query[baseField] = {};
          query[baseField].$gte = value;
        }
        else if (key.endsWith('_lte')) {
          if (!query[baseField]) query[baseField] = {};
          query[baseField].$lte = value;
        }
        else if (key !== '_page' && key !== '_limit') {
          (query as any)[key] = value;
        }
      }
    }

    // Pagination
    const page = parseInt(req.query._page as string) || 1;
    const limit = parseInt(req.query._limit as string) || 10;
    const skip = (page - 1) * limit;
    const realEstates = await RealEstate.find({
      ...query,
      isPriorityBuilding: true,
    })
      .populate('location')
      .skip(skip)
      .limit(limit);

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
                Bucket: env.AWS_BUCKET,
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

export default router;
