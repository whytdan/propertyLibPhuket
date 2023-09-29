import { Schema, model } from 'mongoose';
import { IFile } from 'ts/interfaces.js';

export const RealEstateImageSchema = new Schema<IFile>({
  s3Key: { type: Schema.Types.Mixed, required: false },
  bucket: { type: Schema.Types.Mixed, required: false },
  mime: { type: Schema.Types.Mixed, required: false },
  alt: { type: String, default: null },
});

export const RealEstateImage = model<IFile>(
  'RealEstateImage',
  RealEstateImageSchema
);
