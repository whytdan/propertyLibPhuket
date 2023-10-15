import { Schema, model } from "mongoose";

export interface IPublicPlace {
  title: string;
  description: string;
}

export const PublicPlaceSchema = new Schema<IPublicPlace>({
  title: { type: String, required: true, maxLength: 255 },
  description: { type: String, default: '' },
});

export const PublicPlace = model<IPublicPlace>('PublicPlace', PublicPlaceSchema);