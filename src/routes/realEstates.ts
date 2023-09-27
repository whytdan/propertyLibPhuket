import express from 'express';
import {
  RealEstate,
  RealEstateSchema,
  IRealEstate,
} from '../models/RealEstate.js';

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
    res.json(realEstates);
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
