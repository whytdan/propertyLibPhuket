import express from 'express';
import dotenv from 'dotenv';
import { Location } from '../models/Locaion.js';

dotenv.config();

const router = express.Router();

/* GET locations listing. */
router.get('/', async function (req, res) {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    console.error(`error in locations: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
