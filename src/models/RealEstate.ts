import { model, Schema } from 'mongoose';

export interface IRealEstate {
  title: string;
  price: number;
  roomsAmount: number;
  landArea: number;
  builtUpArea: number;
  kitchenArea: number;
  floor: string;
  bathroomAmount: number;
  balconyAmount: number;
  buildingType: string;
  yearBuilt: number;
  description: string;
  hasRestaraunt: boolean;
  hasParking: boolean;
  hasSpa: boolean;
  hasCommunalPool: boolean;
  hasGym: boolean;
  hasClub: boolean;
  images: string;
}

export const RealEstateSchema = new Schema<IRealEstate>({
  title: { type: String, required: true, maxLength: 255 },
  price: { type: Number, required: true },
  roomsAmount: { type: Number },
  landArea: { type: Number }, // площадь участка
  builtUpArea: { type: Number }, // площадь застройки
  kitchenArea: { type: Number }, // площадь кухни
  floor: { type: String },
  bathroomAmount: { type: Number },
  balconyAmount: { type: Number },
  buildingType: { type: String },
  yearBuilt: { type: Number },
  description: { type: String },
  hasRestaraunt: { type: Boolean, default: false },
  hasParking: { type: Boolean, default: false },
  hasSpa: { type: Boolean, default: false },
  hasCommunalPool: { type: Boolean, default: false },
  hasGym: { type: Boolean, default: false },
  hasClub: { type: Boolean, default: false },
  images: [String],
});

export const RealEstate = model<IRealEstate>('RealEstate', RealEstateSchema);
