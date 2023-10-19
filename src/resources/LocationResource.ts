import { Location } from '../models/Locaion.js';

export const LocationResource = {
  resource: Location,
  options: {
    properties: {
      title_ru: { type: 'string', maxLength: 255 },
      title_en: { type: 'string', maxLength: 255 },
    },
  },
};
