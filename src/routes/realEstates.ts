import express from 'express';
import { RealEstate } from '../models/RealEstate.js';
import { filterSchema } from '../schemas/filter.schema.js';
import { createFilterQuery } from '../utils/creaeteFilterQuery.js';
import { formatRealEstate } from '../utils/formatRealEstate.js';
import zodQueryValidatorMildderware from '../middlewares/zodQueryValidator.middleware copy.js';

const router = express.Router();

/* GET realEstates listing. */
router.get(
  '/',
  zodQueryValidatorMildderware(filterSchema),
  async function (req, res) {
    try {
      const query = filterSchema.parse(req.query);

      const filterQuery = createFilterQuery(query);
      // Pagination
      const skip = (query._page - 1) * query._limit;
      const realEstates = await RealEstate.find(filterQuery)
        .populate('location')
        .populate('publicPlace_1')
        .populate('publicPlace_2')
        .populate('publicPlace_3')
        .populate('publicPlace_4')
        .populate('publicPlace_5')
        .populate('publicPlace_6')
        .skip(skip)
        .limit(query._limit);

      const realEstatesWithDecryptedImages = await Promise.all(realEstates.map(formatRealEstate));

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
    const realEstate = await RealEstate.findById(id)
      .populate('location')
      .populate('publicPlace_1')
      .populate('publicPlace_2')
      .populate('publicPlace_3')
      .populate('publicPlace_4')
      .populate('publicPlace_5')
      .populate('publicPlace_6');

    if (!realEstate) {
      // No record found for given ID
      return res.status(404).json({ error: 'Real estate not found' });
    }

    res.json(formatRealEstate(realEstate));
  } catch (error) {
    console.error(
      `Error fetching real estate with ID ${req.params.id}: ${error}`
    );
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;