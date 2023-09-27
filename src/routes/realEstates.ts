import express from 'express';
import { RealEstate } from '../models/RealEstate.js';

const router = express.Router();

/* GET realEstates listing. */
router.get('/', async function (_, res) {
  try {
    const realEstates = await RealEstate.find();
    res.json(realEstates);
  } catch (error) {
    console.error(`error in realEstates: ${error}`);
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
