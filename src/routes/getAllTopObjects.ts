import express from 'express';
import dotenv from 'dotenv';
import { RealEstate } from '../models/RealEstate.js';

dotenv.config();

const router = express.Router();

/* GET realEstatesWithPriority listing. */
router.get('/', async function (req, res) {
  try {
    const realEstatesWithPriority = await RealEstate.find({
      isPriorityBuilding: true,
    });
    res.json(realEstatesWithPriority);
  } catch (error) {
    console.error(`error in realEstates: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
