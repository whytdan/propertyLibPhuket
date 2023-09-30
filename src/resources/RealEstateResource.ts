import dotenv from 'dotenv';
import uploadFeature from '@adminjs/upload';
import { RealEstate } from '../models/RealEstate.js';
import { componentLoader } from '../utils/componentLoader.js';

dotenv.config();

const AWScredentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: process.env.AWS_REGION || '',
  bucket: process.env.AWS_BUCKET || '',
};

type ImagePropertiesType = {
  [key: string]: {
    type: 'string' | 'number';
    isVisible: boolean;
  };
};

const imageProperties = (options = {}): ImagePropertiesType =>
  ({
    bucket: {
      type: 'string',
      isVisible: false,
      ...options,
    },
    mime: {
      type: 'string',
      isVisible: false,
      ...options,
    },
    key: {
      type: 'string',
      isVisible: false,
      ...options,
    },
    size: {
      type: 'number',
      isVisible: false,
      ...options,
    },
  } as const);

const uploadFeatureFor = (name?: string, multiple = false) =>
  uploadFeature({
    componentLoader,
    provider: { aws: AWScredentials },
    multiple,
    properties: {
      file: name ? `${name}.file` : 'file',
      filePath: name ? `${name}.filePath` : 'filePath',
      filesToDelete: name ? `${name}.filesToDelete` : 'filesToDelete',
      key: name ? `${name}.key` : 'key',
      mimeType: name ? `${name}.mime` : 'mime',
      bucket: name ? `${name}.bucket` : 'bucket',
      size: name ? `${name}.size` : 'size',
    },
    uploadPath: (record, filename) => {
      const path = name
        ? `${record.id()}/${name}/${filename}`
        : `${record.id()}/global/${filename}`;

      return path;
    },
  });

const imagePropertiesFor = (name: string, options = {}) => {
  const properties = imageProperties(options);
  return Object.keys(properties).reduce(
    (memo, key) => ({
      ...memo,
      [`${name}.${key}`]: properties[key],
    }),
    {}
  );
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
      location: { type: 'string' },
      mainImage: {
        type: 'mixed',
      },
      images: {
        type: 'mixed',
      },
      ...imagePropertiesFor('mainImage'),
      ...imagePropertiesFor('images', { isArray: true }),
    },
  },
  features: [uploadFeatureFor('mainImage'), uploadFeatureFor('images', true)],
};
