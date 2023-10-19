import { model, Schema } from 'mongoose';

export interface ILocation {
  _id: string;
  title_ru: string;
  title_en: string;
}

export const LocationSchema = new Schema<ILocation>({
  title_ru: { type: String, required: true, maxLength: 255 },
  title_en: { type: String, required: true, maxLength: 255 },
});

export const Location = model<ILocation>('Location', LocationSchema);
