import uploadFeature from '@adminjs/upload';
import { RealEstate } from '../models/RealEstate.js';
import { componentLoader } from '../utils/componentLoader.js';
import { env } from '../env.js';
import { ResourceWithOptions } from 'adminjs';

const AWScredentials = {
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION,
  bucket: env.AWS_BUCKET,
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

export const RealEstateResource: ResourceWithOptions = {
  resource: RealEstate,
  options: {
    properties: {
      titleCard: { type: 'string' },
      price: { type: 'number' },
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
      description_ru: { type: 'richtext' },
      description_en: { type: 'richtext' },
      isRent: { type: 'boolean' },
      location: {
        type: 'reference',
        isRequired: false,
      },
      mainImage: {
        type: 'mixed',
      },
      images: {
        type: 'mixed',
      },
      isPriorityBuilding: { type: 'boolean' },
      publicPlaces: {
        type: 'reference',
        isArray: true,
      },
      publicPlace_1: {
        type: 'reference'
      },
      publicPlace_2: {
        type: 'reference'
      },
      publicPlace_3: {
        type: 'reference'
      },
      publicPlace_4: {
        type: 'reference'
      },
      publicPlace_5: {
        type: 'reference'
      },
      publicPlace_6: {
        type: 'reference'
      },
      ...imagePropertiesFor('mainImage'),
      ...imagePropertiesFor('images', { isArray: true }),
    },
  },
  features: [uploadFeatureFor('mainImage'), uploadFeatureFor('images', true)],
};
