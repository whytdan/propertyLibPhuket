import { model, Schema } from 'mongoose';

export interface ILocation {
  _id: string;
  title1: string;
  title2: string;
  title3: string;
}

export const LocationSchema = new Schema<ILocation>({
  title1: { type: String, required: true, maxLength: 255 },
  title2: { type: String, required: false, maxLength: 255 },
  title3: { type: String, required: false, maxLength: 255 },
});

export const Location = model<ILocation>('Location', LocationSchema);
