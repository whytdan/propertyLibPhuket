import { model, Schema } from 'mongoose';

export interface ILocation {
  _id: string;
  title: string;
}

export const LocationSchema = new Schema<ILocation>({
  title: { type: String, required: true, maxLength: 255 },
});

export const Location = model<ILocation>('Location', LocationSchema);
