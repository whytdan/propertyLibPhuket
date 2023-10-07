import dotenv from 'dotenv';
import { Location } from '../models/Locaion.js';

dotenv.config();

export const LocationResource = {
  resource: Location,
  options: {
    properties: {
      title: { type: 'string', maxLength: 255 },
    },
  },
};
