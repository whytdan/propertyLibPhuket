import { FilterQuery } from "mongoose";
import { IRealEstate } from "../models/RealEstate.js";
import { FilterParams } from "../schemas/filter.schema.js";

type Query = FilterQuery<IRealEstate> & {
  _page?: number;
  _limit?: number;
}

export const createFilterQuery = (params: FilterParams): Query => {
  return {
    isVilla: params.isVilla,
    isApartment: params.isApartment,
    location: params.location,
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