import { Schema, model } from "mongoose";

export interface IPublicPlace {
  title_ru: string;
  title_en: string;
  description_ru: string;
  description_en: string;
}

export const PublicPlaceSchema = new Schema<IPublicPlace>({
  title_ru: { type: String, required: true, maxLength: 255 },
  title_en: { type: String, required: true, maxLength: 255 },
  description_ru: { type: String, default: '' },
  description_en: { type: String, default: '' },
});

export const PublicPlace = model<IPublicPlace>('PublicPlace', PublicPlaceSchema);