import express from 'express';
import dotenv from 'dotenv';
import {
  RealEstate,
  RealEstateSchema,
  IRealEstate,
} from '../models/RealEstate.js';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import mongoose from 'mongoose';

dotenv.config();

const s3ClientParams = { region: process.env.AWS_REGION };
const s3Client = new S3Client(s3ClientParams);

const router = express.Router();

/* GET realEstates listing. */
router.get('/', async function (req, res) {
  try {
    const query: Partial<IRealEstate> & {
      _page?: number;
      _limit?: number;
      [key: string]: any;
    } = {};

    // Get the list of fields from the schema
    const allowedFields = Object.keys(RealEstateSchema.paths);

    // Filter by query parameters
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value !== 'string') continue;

      const baseField = key.replace(/_(gte|lte)$/, ''); // Extract base field name

      if (allowedFields.includes(baseField)) {
        // Check for special filters like _gte and _lte
        if (key.endsWith('_gte')) {
          if (!query[baseField]) query[baseField] = {};
          query[baseField].$gte = value;
        } else if (key.endsWith('_lte')) {
          if (!query[baseField]) query[baseField] = {};
          query[baseField].$lte = value;
        } else if (key !== '_page' && key !== '_limit') {
          (query as any)[key] = value;
        }
      }
    }

    // Pagination
    const page = parseInt(req.query._page as string) || 1;
    const limit = parseInt(req.query._limit as string) || 10;
    const skip = (page - 1) * limit;
    const realEstates = await RealEstate.find(query)
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
router.get('/:id', async function (req, res) {
  try {
    const id = req.params.id; // Extracting ID from route parameters

    // Find real estate record by ID
    const realEstate = await RealEstate.findById(id).populate('location');

    if (!realEstate) {
      // No record found for given ID
      return res.status(404).json({ error: 'Real estate not found' });
    }

    // If mainImage exists, get the signed URL
    let mainImageUrl = '';
    if (realEstate.mainImage) {
      const mainImageParams = {
        Bucket: realEstate.mainImage.bucket,
        Key: realEstate.mainImage.key,
      };
      const mainImageCommand = new GetObjectCommand(mainImageParams);
      mainImageUrl = await getSignedUrl(s3Client, mainImageCommand);
    }

    // If other images exist, get their signed URLs
    const realEstateImages = [];
    if (realEstate?.images?.key?.length) {
      for (let key of realEstate.images.key) {
        const imageParams = {
          Bucket: process.env.AWS_BUCKET,
          Key: key,
        };
        const command = new GetObjectCommand(imageParams);
        const url = await getSignedUrl(s3Client, command);
        realEstateImages.push({ url });
      }
    }

    // Construct the response object
    const responseObj = {
      ...realEstate.toObject(),
      mainImage: {
        url: mainImageUrl,
      },
      images: realEstateImages,
    };

    res.json(responseObj);
  } catch (error) {
    console.error(
      `Error fetching real estate with ID ${req.params.id}: ${error}`
    );
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* POST realEstate creation */
router.post('/', function (req, res) {});

/* PATCH updating realEstate */
router.patch('/:id', function (req, res) {});

/* DELETE updating realEstate */
router.delete('/:id', function (req, res) {});

export default router;
