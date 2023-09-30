import { Schema, model } from 'mongoose';
import { IFile } from 'ts/interfaces.js';

export const RealEstateImageSchema = new Schema<IFile>({
  key: { type: String, required: false },
  bucket: { type: String, required: false },
  mime: { type: String, required: false },
  size: { type: Number, required: false },
});

export const RealEstateImage = model<IFile>(
  'RealEstateImage',
  RealEstateImageSchema
);
