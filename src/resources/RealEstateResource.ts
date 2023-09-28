import { RealEstate } from '../models/RealEstate.js';

export const RealEstateResource = {
  resource: RealEstate,
  options: {
    properties: {
      title: { type: 'string', maxLength: 255 },
      price: { type: 'number', required: true },
      roomsAmount: { type: 'number' },
      landArea: { type: 'number' }, // площадь участка
      builtUpArea: { type: 'number' }, // площадь застройки
      kitchenArea: { type: 'number' }, // площадь кухни
      floor: { type: 'string' },
      bathroomAmount: { type: 'number' },
      balconyAmount: { type: 'number' },
      buildingType: { type: 'string' },
      yearBuilt: { type: 'number' },
      description: { type: 'richtext' },
      hasRestaraunt: { type: 'boolean' },
      hasParking: { type: 'boolean' },
      hasSpa: { type: 'boolean' },
      hasCommunalPool: { type: 'boolean' },
      hasGym: { type: 'boolean' },
      hasClub: { type: 'boolean' },
    },
  },
};
