import dotenv from 'dotenv';
import uploadFeature from '@adminjs/upload';
import { RealEstate } from '../models/RealEstate.js';
import { componentLoader } from '../utils/componentLoader.js';
import { Location } from '../models/Locaion.js';

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
      titleCard: { type: 'string', maxLength: 255 },
      price: { type: 'number', required: true },
      priceMillionBahtFrom: { type: 'number' },
      priceMillionBahtTo: { type: 'number' },
      priceSquereFrom: { type: 'number' },
      priceSquereTo: { type: 'number' },
      badroomsAmountFrom: { type: 'number' },
      badroomsAmountTo: { type: 'number' },
      builtUpAreaFrom: { type: 'number' },
      builtUpAreaTo: { type: 'number' },
      landAreaFrom: { type: 'number' },
      landAreaTo: { type: 'number' },
      beachBang: { type: 'number' },
      beachLian: { type: 'number' },

      roomsAmount: { type: 'number' },
      yearBuilt: { type: 'number' },
      description: { type: 'richtext' },
      isRent: { type: 'boolean' },
      location: {
        type: 'reference',
        target: 'Location', // This should match the model name in Mongoose
        isRequired: false,
      },
      mainImage: {
        type: 'mixed',
      },
      images: {
        type: 'mixed',
      },
      UWCShool: {
        type: 'string',
      },
      villaMarket: {
        type: 'string',
      },
      blueTreeAquaPark: {
        type: 'string',
      },
      royalMarinaPhuket: {
        type: 'string',
      },
      airport: {
        type: 'string',
      },
      bangkokHospital: {
        type: 'string',
      },
      isPriorityBuilding: { type: 'boolean' },
      ...imagePropertiesFor('mainImage'),
      ...imagePropertiesFor('images', { isArray: true }),
    },
    populate: {
      location: {
        resource: Location,
      },
    },

    actions: {
      show: {
        populate: ['location'],
      },
      edit: {
        populate: ['location'],
      },
      list: {
        populate: ['location'],
      },
    },
  },
  features: [uploadFeatureFor('mainImage'), uploadFeatureFor('images', true)],
};
