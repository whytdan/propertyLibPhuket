import { Schema, model, Types } from 'mongoose';

interface IFile {
  s3Key: string;
  bucket: string;
  mime: string;
  comment: string | null;
}

export interface IRealEstateImage extends IFile {
  realEstateId: Types.ObjectId; // Reference to the RealEstate model
}

export const RealEstateImageSchema = new Schema<IRealEstateImage>({
  s3Key: { type: Schema.Types.Mixed, required: false },
  bucket: { type: Schema.Types.Mixed, required: false },
  mime: { type: Schema.Types.Mixed, required: false },
  comment: { type: String, default: null },
  realEstateId: {
    type: Schema.Types.ObjectId,
    ref: 'RealEstate',
    required: true,
  },
});

export const RealEstateImage = model<IRealEstateImage>(
  'RealEstateImage',
  RealEstateImageSchema
);
