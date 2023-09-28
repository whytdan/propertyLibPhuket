import dotenv from 'dotenv';
import uploadFeature from '@adminjs/upload';
import { componentLoader } from '../utils/componentLoader.js';

import { RealEstateImage } from '../models/RealEstateImage.js';

dotenv.config();

const AWScredentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: process.env.AWS_REGION || '',
  bucket: process.env.AWS_BUCKET || '',
};

export const RealEstateImageResource = {
  resource: RealEstateImage,
  features: [
    uploadFeature({
      componentLoader,
      provider: { aws: AWScredentials },
      properties: {
        key: 's3Key', // to this db field feature will safe S3 key
        mimeType: 'mime', // this property is important because allows to have previews
      },
    }),
  ],
};
// {
//   resource: RealEstateImage,
//   options: {
//     properties: {
//       s3Key: {
//         type: 'string',
//       },
//       bucket: {
//         type: 'string',
//       },
//       mime: {
//         type: 'string',
//       },
//       comment: {
//         type: 'textarea',
//         isSortable: false,
//       },
//     },
//   },
//   features: [
//     uploadFeature({
//       componentLoader,
//       provider: { aws: AWScredentials },
//       properties: {
//         key: 's3Key', // to this db field feature will safe S3 key
//         mimeType: 'mime', // this property is important because allows to have previews
//       },
//     }),
//   ],
// };
