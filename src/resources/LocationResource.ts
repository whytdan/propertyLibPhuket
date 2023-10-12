import dotenv from 'dotenv';
import { Location } from '../models/Locaion.js';

dotenv.config();

export const LocationResource = {
  resource: Location,
  options: {
    properties: {
      title1: { type: 'string', maxLength: 255 },
      title2: { type: 'string', maxLength: 255 },
      title3: { type: 'string', maxLength: 255 },
    },
  },
};
