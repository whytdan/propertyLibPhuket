import { model, ObjectId, Schema } from 'mongoose';
import { IFile, IFiles } from 'ts/interfaces.js';
import { ILocation } from './Locaion.js';
import { IPublicPlace } from './PublicPlace.js';

export interface IRealEstate {
  _id: string;
  titleCard_ru: string;
  titleCard_en: string;
  buildingType: string;
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
  description_ru: string;
  description_en: string;
  isRent: boolean;
  location: ILocation | null | ObjectId; // Added this
  mainImage: IFile;
  images: IFiles;
  isPriorityBuilding: boolean;
  isVilla: boolean;
  isApartment: boolean;

  publicPlaces: (IPublicPlace | ObjectId)[];
  publicPlace_1: IPublicPlace | ObjectId;
  publicPlace_2: IPublicPlace | ObjectId;
  publicPlace_3: IPublicPlace | ObjectId;
  publicPlace_4: IPublicPlace | ObjectId;
  publicPlace_5: IPublicPlace | ObjectId;
  publicPlace_6: IPublicPlace | ObjectId;
}

export const RealEstateSchema = new Schema<IRealEstate>({
  titleCard_ru: { type: String, required: true, maxLength: 255 },
  titleCard_en: { type: String, required: true, maxLength: 255 },
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
  beachBang: { type: Number, required: true },
  beachLian: { type: Number, required: true },
  buildingType: { type: String },

  roomsAmount: { type: Number },
  yearBuilt: { type: Number },
  description_ru: { type: String, default: '' },
  description_en: { type: String, default: '' },
  isVilla: { type: Boolean, default: false },
  isApartment: { type: Boolean, default: false },

  isRent: { type: Boolean, default: false },
  location: { type: Schema.Types.ObjectId, ref: 'Location' },
  mainImage: { type: Schema.Types.Mixed },
  images: { type: Schema.Types.Mixed },

  isPriorityBuilding: { type: Boolean, default: false },
  publicPlaces: { type: [{ type: Schema.Types.ObjectId, ref: 'PublicPlace' }] },
  publicPlace_1: { type: Schema.Types.ObjectId, ref: 'PublicPlace' },
  publicPlace_2: { type: Schema.Types.ObjectId, ref: 'PublicPlace' },
  publicPlace_3: { type: Schema.Types.ObjectId, ref: 'PublicPlace' },
  publicPlace_4: { type: Schema.Types.ObjectId, ref: 'PublicPlace' },
  publicPlace_5: { type: Schema.Types.ObjectId, ref: 'PublicPlace' },
  publicPlace_6: { type: Schema.Types.ObjectId, ref: 'PublicPlace' },
});

export const RealEstate = model<IRealEstate>('RealEstate', RealEstateSchema);
