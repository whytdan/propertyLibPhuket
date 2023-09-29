import dotenv from 'dotenv';
import uploadFileFeature from '@adminjs/upload';
import { RealEstate } from '../models/RealEstate.js';
import { componentLoader } from '../utils/componentLoader.js';

dotenv.config();

const AWScredentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: process.env.AWS_REGION || '',
  bucket: process.env.AWS_BUCKET || '',
};

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
  features: [
    uploadFileFeature({
      componentLoader,
      properties: {
        key: 'mainImage.s3Key', // to this db field feature will safe S3 key
        mimeType: 'mainImage.mime', // this property is important because allows to have previews
        bucket: 'mainImage.bucket', // Field to save the bucket nam
      },
      provider: { aws: AWScredentials },
    }),
  ],
};
