import { model, ObjectId, Schema } from 'mongoose';
import { IFile, IFiles } from 'ts/interfaces.js';
import { ILocation } from './Locaion.js';

export interface IRealEstate {
  _id: string;
  titleCard: string;
  price: number;
  priceMillionBahtFrom: number;
  priceMillionBahtTo: number;
  priceSquereFrom: number;
  priceSquereTo: number;
  badroomsAmountFrom: number;
  badroomsAmountTo: number;
  builtUpAreaFrom: number;
  builtUpAreaTo: number;
  landAreaFrom: number;
  landAreaTo: number;
  beachBang: number;
  beachLian: number;
  roomsAmount: number;
  yearBuilt: number;
  description: string;
  isRent: boolean;
  location: ILocation | null | ObjectId; // Added this
  mainImage: IFile;
  images: IFiles;

  UWCShool: string;
  villaMarket: string;
  blueTreeAquaPark: string;
  royalMarinaPhuket: string;
  airport: string;
  bangkokHospital: string;
  isPriorityBuilding: boolean;
}

export const RealEstateSchema = new Schema<IRealEstate>({
  titleCard: { type: String, required: true, maxLength: 255 },
  price: { type: Number, required: true },
  priceMillionBahtFrom: { type: Number },
  priceMillionBahtTo: { type: Number },
  priceSquereFrom: { type: Number },
  priceSquereTo: { type: Number },
  badroomsAmountFrom: { type: Number },
  badroomsAmountTo: { type: Number },
  builtUpAreaFrom: { type: Number },
  builtUpAreaTo: { type: Number },
  landAreaFrom: { type: Number },
  landAreaTo: { type: Number },
  beachBang: { type: Number },
  beachLian: { type: Number },

  roomsAmount: { type: Number },
  yearBuilt: { type: Number },
  description: { type: String },

  isRent: { type: Boolean, default: false },
  location: { type: Schema.Types.ObjectId, ref: 'Location' },
  mainImage: { type: Schema.Types.Mixed },
  images: { type: Schema.Types.Mixed },

  UWCShool: { type: String },
  villaMarket: { type: String },
  blueTreeAquaPark: { type: String },
  royalMarinaPhuket: { type: String },
  airport: { type: String },
  bangkokHospital: { type: String },
  isPriorityBuilding: { type: Boolean, default: false },
});

export const RealEstate = model<IRealEstate>('RealEstate', RealEstateSchema);
