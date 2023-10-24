import { FilterQuery } from "mongoose";
import { IRealEstate } from "../models/RealEstate.js";
import { FilterParams } from "../schemas/filter.schema.js";

type Query = FilterQuery<IRealEstate>

export const createFilterQuery = (params: FilterParams): Query => {
  return {
    isRent: params.isRent,
    isVilla: params.isVilla,
    location: params.location,
    isApartment: params.isApartment,
    badroomsAmountFrom: {
      $gte: params.badroomsAmount_gte,
    },
    badroomsAmountTo: {
      $lte: params.badroomsAmount_lte,
    },
    builtUpAreaFrom: {
      $gte: params.builtUpArea_gte,
    },
    builtUpAreaTo: {
      $lte: params.builtUpArea_lte,
    },
    landAreaFrom: {
      $gte: params.landArea_gte,
    },
    landAreaTo: {
      $lte: params.landArea_lte,
    },
    priceMillionBahtFrom: {
      $gte: params.price_gte,
    },
    priceMillionBahtTo: {
      $lte: params.price_lte,
    },
  }
}