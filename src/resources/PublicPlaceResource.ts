import { PublicPlace } from "../models/PublicPlace.js";

export const PublicPlaceResource = {
  resource: PublicPlace,
  options: {
    properties: {
      title_ru: { type: 'string', maxLength: 255 },
      title_en: { type: 'string', maxLength: 255 },
      description_ru: { type: 'string', maxLength: 255 },
      description_en: { type: 'string', maxLength: 255 },
    },
  },
};