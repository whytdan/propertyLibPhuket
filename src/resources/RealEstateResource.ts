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
      titleCard_ru: { type: 'string' },
      titleCard_en: { type: 'string' },
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
      description_ru: { type: 'textarea' },
      description_en: { type: 'textarea' },
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
      isVilla: { type: 'boolean' },
      isApartment: { type: 'boolean' },

      publicPlace_1: { type: 'reference', description: 'Место по близости 1' },
      publicPlace_1_time: { type: 'string', description: 'Время' },
      publicPlace_2: { type: 'reference', description: 'Место по близости 2' },
      publicPlace_2_time: { type: 'string', description: 'Время' },
      publicPlace_3: { type: 'reference', description: 'Место по близости 3' },
      publicPlace_3_time: { type: 'string', description: 'Время' },
      publicPlace_4: { type: 'reference', description: 'Место по близости 4' },
      publicPlace_4_time: { type: 'string', description: 'Время' },
      publicPlace_5: { type: 'reference', description: 'Место по близости 5' },
      publicPlace_5_time: { type: 'string', description: 'Время' },
      publicPlace_6: { type: 'reference', description: 'Место по близости 6' },
      publicPlace_6_time: { type: 'string', description: 'Время' },
      showInTelegramBot: { type: 'boolean', description: 'Показывать в телеграм боте' },
      ...imagePropertiesFor('mainImage'),
      ...imagePropertiesFor('images', { isArray: true }),
    },
  },
  features: [uploadFeatureFor('mainImage'), uploadFeatureFor('images', true)],
};
