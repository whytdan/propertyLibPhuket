import { PublicPlace } from "../models/PublicPlace.js";

export const PublicPlaceResource = {
  resource: PublicPlace,
  options: {
    properties: {
      title: { type: 'string', maxLength: 255 },
      description: { type: 'string', maxLength: 255 },
    },
  },
};